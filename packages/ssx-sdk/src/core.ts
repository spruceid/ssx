import { ethers } from 'ethers';
import {
  initialized,
  ssxSession,
} from '@spruceid/ssx-sdk-wasm';
import merge from 'lodash.merge';
import axios, { AxiosInstance } from 'axios';
import { generateNonce } from 'siwe';
import {
  SSXClientSession,
  SSXClientConfig,
  SSXEnsResolveOptions,
  ISSXConnected,
  SSXExtension
} from '@spruceid/ssx-core';

/** Initializer for an SSXClientSession. */
export class SSXInit {
  /** Extensions for the SSXClientSession. */
  private extensions: SSXExtension[] = [];

  constructor(private config?: SSXClientConfig) { }

  /** Extend the session with an SSX compatible extension. */
  extend(extension: SSXExtension) {
    this.extensions.push(extension);
  }

  /** 
   * Connect to the signing account using the configured provider. 
   * @returns SSXConnected instance.
   */
  async connect(): Promise<SSXConnected> {
    // TODO(w4ll3): consider creating a custom error object, i.e: SSXConnectError
    let provider: ethers.providers.Web3Provider;

    // eslint-disable-next-line no-underscore-dangle
    if (!this.config.providers.web3.driver?._isProvider) {
      try {
        provider = new ethers.providers.Web3Provider(this.config.providers.web3.driver);
      } catch (err) {
        // Provider creation error
        console.error(err);
        throw err;
      }
    } else {
      provider = this.config.providers.web3.driver;
    }

    if (!this.config.providers.web3?.driver?.bridge?.includes('walletconnect')) {
      const connectedAccounts = await provider.listAccounts();
      if (connectedAccounts.length === 0) {
        try {
          await provider.send('wallet_requestPermissions', [{ eth_accounts: {} }]);
        } catch (err) {
          // Permission rejected error
          console.error(err);
          throw err;
        }
      }
    }

    let builder;
    try {
      builder = await initialized
        .then(() => new ssxSession.SSXSessionBuilder());
    } catch (err) {
      // SSX wasm related error
      console.error(err);
      throw err;
    }

    return new SSXConnected(builder, this.config, this.extensions, provider);
  }
}

/** An intermediate SSX state: connected, but not signed-in. */
export class SSXConnected implements ISSXConnected {
  /** 
   * Promise that is initialized on construction of this class to run the "afterConnect" methods
   * of the extensions.
   */
  public afterConnectHooksPromise: Promise<void>;

  /** Verifies if extension is enabled. */
  public isExtensionEnabled = (namespace: string) => this.extensions.filter((e) => e.namespace === namespace).length === 1;

  /** Axios instance. */
  public api?: AxiosInstance;

  constructor(
    /** Instance of SSXSessionBuilder */
    public builder: ssxSession.SSXSessionBuilder,
    /** SSXConfig object. */
    public config: SSXClientConfig,
    /** Enabled extensions. */
    public extensions: SSXExtension[],
    /** EthersJS provider. */
    public provider: ethers.providers.Web3Provider,
  ) {
    this.afterConnectHooksPromise = this.applyExtensions();
    if (this.config.providers?.server?.host) {
      this.api = axios.create({
        baseURL: this.config.providers.server.host,
        withCredentials: true,
      });
    }
  }

  /** Applies the "afterConnect" methods and the delegated capabilities of the extensions. */
  public async applyExtensions(): Promise<void> {
    for (const extension of this.extensions) {
      if (extension.afterConnect) {
        const overrides = await extension.afterConnect(this);
        this.config = { ...this.config, siweConfig: { ...overrides?.siwe } };
      }

      if (extension.namespace && extension.defaultActions) {
        const defaults = await extension.defaultActions();
        this.builder.addDefaultActions(extension.namespace, defaults);
      }

      if (extension.namespace && extension.extraFields) {
        const defaults = await extension.extraFields();
        this.builder.addExtraFields(extension.namespace, defaults);
      }

      if (extension.namespace && extension.targetedActions) {
        const targetedActions = await extension.targetedActions();
        for (const target in targetedActions) {
          this.builder.addTargetedActions(
            extension.namespace,
            target,
            targetedActions[target],
          );
        }
      }
    }
  }

  /** 
   * Applies the "afterSignIn" methods of the extensions. 
   * @param session - SSXClientSession object.
   */
  public async afterSignIn(session: SSXClientSession): Promise<void> {
    for (const extension of this.extensions) {
      if (extension.afterSignIn) {
        await extension.afterSignIn(session);
      }
    }
  }

  /** 
   * Requests nonce from server. 
   * @param params - Request params.
   * @returns Promise with nonce.
   */
  public async ssxServerNonce(params: Record<string, any>): Promise<string> {
    if (this.api) {
      let nonce;
      try {
        nonce = (await this.api.get(this.config.providers?.server?.routes?.nonce ?? '/ssx-nonce', { params })).data;
      } catch (error) {
        console.error(error);
        throw error;
      }
      if (!nonce) {
        throw new Error('Unable to retrieve nonce from server.');
      }
      return nonce;
    }
  }

  /** 
   * Requests sign in from server and returns session. 
   * @param session - SSXClientSession object.
   * @returns Promise with server session data.
   */
  public async ssxServerLogin(session: SSXClientSession): Promise<any> {
    if (this.api) {
      let resolveEns: boolean | SSXEnsResolveOptions = false;
      if (typeof this.config.resolveEns === 'object' && this.config.resolveEns.resolveOnServer) {
        resolveEns = this.config.resolveEns.resolve;
      }
      try {
        // @TODO(w4ll3): figure out how to send a custom sessionKey
        return this.api.post(this.config.providers?.server?.routes?.login ?? '/ssx-login', {
          signature: session.signature,
          siwe: session.siwe,
          address: session.address,
          walletAddress: session.walletAddress,
          chainId: session.chainId,
          daoLogin: this.isExtensionEnabled('delegationRegistry'),
          resolveEns
        })
          .then((response) => response.data);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }

  /** 
   * Requests the user to sign in.
   * Generates the SIWE message for this session, requests the configured
   * Signer to sign the message, calls the "afterSignIn" methods of the
   * extensions.
   * @returns Promise with the SSXClientSession object.
   */
  async signIn(): Promise<SSXClientSession> {
    await this.afterConnectHooksPromise;

    const sessionKey = this.builder.jwk();
    if (sessionKey === undefined) {
      return Promise.reject(new Error('unable to retrieve session key'));
    }

    const defaults = {
      address: await this.provider.getSigner().getAddress(),
      chainId: await this.provider.getSigner().getChainId(),
      domain: globalThis.location.hostname,
      issuedAt: new Date().toISOString(),
      nonce: generateNonce(),
    };

    const serverNonce = await this.ssxServerNonce(defaults);
    if (serverNonce) defaults.nonce = serverNonce;

    const siweConfig = merge(defaults, this.config.siweConfig);

    const siwe = await this.builder.build(siweConfig);

    const signature = await this.provider.getSigner().signMessage(siwe);

    let session = {
      address: siweConfig.address,
      walletAddress: await this.provider.getSigner().getAddress(),
      chainId: siweConfig.chainId,
      sessionKey,
      siwe,
      signature,
    };

    const response = await this.ssxServerLogin(session);

    session = {
      ...session,
      ...response,
    };

    await this.afterSignIn(session);

    return session;
  }

  /** 
   * Requests the user to sign out.
   * @param session - SSXClientSession object.
   */
  async signOut(session: SSXClientSession): Promise<void> {
    if (this.api) {
      try {
        await this.api.post(this.config.providers?.server?.routes?.logout ?? '/ssx-logout', { ...session });
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }
}

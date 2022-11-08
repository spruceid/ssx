import { ethers } from 'ethers';
import {
  initialized,
  ssxSession,
} from '@spruceid/ssx-sdk-wasm';
import merge from 'lodash.merge';
import axios, { AxiosInstance } from 'axios';
import { generateNonce } from 'siwe';
import { SSXExtension } from './extension';
import {
  SSXSession,
  SSXConfig,
} from './types';

/** Initializer for an SSXSession. */
export class SSXInit {
  /** Extensions for the SSXSession. */
  private extensions: SSXExtension[] = [];

  constructor(private config?: SSXConfig) { }

  /** Extend the session with an SSX compatible extension. */
  extend(extension: SSXExtension) {
    this.extensions.push(extension);
  }

  /** Connect to the signing account using the configured provider. */
  async connect(): Promise<SSXConnected> {
    // TODO(w4ll3): consider creating a custom error object, i.e: SSXConnectError
    let provider: ethers.providers.Web3Provider;

    try {
      // eslint-disable-next-line no-underscore-dangle
      if (!this.config.providers.web3.driver?._isProvider) {
        provider = new ethers.providers.Web3Provider(this.config.providers.web3.driver);
      } else {
        provider = this.config.providers.web3.driver;
      }
      try {
        if (!this.config.providers.web3?.driver?.bridge?.includes('walletconnect')) {
          await provider.send('wallet_requestPermissions', [{ eth_accounts: {} }]);
        }
      } catch (err) {
        // Permission rejected error
        console.error(err);
        throw err;
      }
    } catch (err) {
      // Provider creation error
      console.error(err);
      throw err;
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
export class SSXConnected {
  /** Promise that is initialized on construction of this class to run the "afterConnect" methods
   * of the extensions.
   */
  public afterConnectHooksPromise: Promise<void>;

  public isExtensionEnabled = (namespace: string) => this.extensions.filter((e) => e.namespace === namespace).length === 1;

  public api?: AxiosInstance;

  constructor(
    public builder: ssxSession.SSXSessionBuilder,
    public config: SSXConfig,
    public extensions: SSXExtension[],
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

  /** Applies the "afterSignIn" methods of the extensions. */
  public async afterSignIn(session: SSXSession): Promise<void> {
    for (const extension of this.extensions) {
      if (extension.afterSignIn) {
        await extension.afterSignIn(session);
      }
    }
  }

  public async ssxServerNonce(params: Record<string, any>): Promise<string> {
    try {
      if (this.api) {
        const { data: nonce } = await this.api.get('/ssx-nonce', { params });
        return nonce;
      }
    } catch (error) {
      // were do we log this error? ssx.log?
      // show to user?
      console.error(error);
      throw error;
    }
  }

  public async ssxServerLogin(session: SSXSession): Promise<any> {
    try {
      if (this.api) {
        // @TODO(w4ll3): figure out how to send a custom sessionKey
        return this.api.post('/ssx-login', {
          signature: session.signature,
          siwe: session.siwe,
          address: session.address,
          walletAddress: session.walletAddress,
          chainId: session.chainId,
          daoLogin: this.isExtensionEnabled('delegationRegistry'),
        })
          .then((response) => response.data);
      }
    } catch (error) {
      // were do we log this error? ssx.log?
      // show to user?
      console.error(error);
      throw error;
    }
  }

  /** Requests the user to sign in.
     *
     * Generates the SIWE message for this session, requests the configured
     * Signer to sign the message, calls the "afterSignIn" methods of the
     * extensions and returns the SSXSession object.
     */
  async signIn(): Promise<SSXSession> {
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

  async signOut(session: SSXSession): Promise<void> {
    try {
      if (this.api) {
        await this.api.post('/ssx-logout', { ...session });
      }
    } catch (error) {
      // were do we log this error? ssx.log?
      // show to user?
      console.error(error);
      throw error;
    }
  }
}

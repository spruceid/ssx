import { GnosisDelegation } from '@spruceid/ssx-gnosis-extension';
import {
  SSXConnected,
  SSXInit,
} from './core';
import {
  SSXClientConfig,
  SSXClientSession,
  SSXRPCProviders,
  SSXEnsData,
  SSXEnsResolveOptions,
} from '@spruceid/ssx-core';

declare global {
  interface Window {
    ethereum?: any
  }
}

const SSX_DEFAULT_CONFIG: SSXClientConfig = {
  providers: {
    web3: {
      driver: globalThis.ethereum,
    },
  },
};

/** SSX: Self-sovereign anything.
 *
 * A toolbox for user-controlled identity, credentials, storage and more.
 */
export class SSX {
  /** SSXClientSession builder. */
  private init: SSXInit;

  /** The session representation (once signed in). */
  public session?: SSXClientSession;

  /** Current connection of SSX */
  public connection?: SSXConnected;

  /** Supported RPC Providers */
  public static RPCProviders = SSXRPCProviders;

  constructor(private config: SSXClientConfig = SSX_DEFAULT_CONFIG) {
    this.init = new SSXInit({ ...this.config, providers: { ...SSX_DEFAULT_CONFIG.providers, ...this.config?.providers } });

    if (this.config.enableDaoLogin) {
      const gnosis = new GnosisDelegation();
      this.init.extend(gnosis);
    }
  }

  /** 
   * Request the user to sign in, and start the session. 
   * @returns Object containing information about the session
   */
  async signIn(): Promise<SSXClientSession> {
    try {
      this.connection = await this.init.connect();
    } catch (err) {
      // Something went wrong when connecting or creating Session (wasm)
      console.error(err);
      throw err;
    }

    try {
      this.session = await this.connection.signIn();
      if (this.config.resolveEns) {
        if (this.config.resolveEns === true) {
          this.session.ens = await this.resolveEns(this.session.address);
        } else if (!this.config.resolveEns.resolveOnServer) {
          this.session.ens = await this.resolveEns(this.session.address, this.config.resolveEns.resolve);
        }
      }
      return this.session;
    } catch (err) {
      // Request to /ssx-login went wrong
      console.error(err);
      throw err;
    }
  }

  /**
   * ENS data supported by SSX. 
   * @param address - User address.
   * @param resolveEnsOpts - Options to resolve ENS.
   * @returns Object containing ENS data.
   */
  async resolveEns(
    /** User address */
    address: string,
    resolveEnsOpts: SSXEnsResolveOptions = {
        domain: true,
        avatar: true
      }
  ): Promise<SSXEnsData> {
    if (!address) {
      throw new Error('Missing address.');
    }
    let ens: SSXEnsData = {};
    let promises: Array<Promise<any>> = [];
    if (resolveEnsOpts?.domain) {
      promises.push(this.connection.provider.lookupAddress(address))
    }
    if (resolveEnsOpts?.avatar) {
      promises.push(this.connection.provider.getAvatar(address))
    }

    await Promise.all(promises)
      .then(([domain, avatarUrl]) => {
        if (!resolveEnsOpts?.domain && resolveEnsOpts?.avatar) {
          [domain, avatarUrl] = [undefined, domain];
        }
        if (domain) {
          ens['domain'] = domain;
        }
        if (avatarUrl) {
          ens['avatarUrl'] = avatarUrl;
        }
      });

    return ens;
  }

  /**
   * Invalidates user's session.
   */
  async signOut() {
    try {
      await this.connection.signOut(this.session);
      this.session = null;
      this.connection = null;
    } catch (err) {
      // request to /ssx-logout went wrong
      console.error(err);
      throw err;
    }
  }

  /** Get the address that is connected and signed in. */
  address: () => string | undefined = () => this.session?.address;

  /** Get the chainId that the address is connected and signed in on. */
  chainId: () => number | undefined = () => this.session?.chainId;
}

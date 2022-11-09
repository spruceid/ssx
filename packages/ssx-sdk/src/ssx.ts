import { GnosisDelegation } from '@spruceid/ssx-gnosis-extension';
import {
  SSXConnected,
  SSXInit,
} from './core';
import {
  SSXConfig,
  SSXSession,
  SSXRPCProviders,
  SSXEnsData,
} from './types';

declare global {
  interface Window {
    ethereum?: any
  }
}

const SSX_DEFAULT_CONFIG: SSXConfig = {
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
  /** SSXSession builder. */
  private init: SSXInit;

  /** The session representation (once signed in). */
  public session?: SSXSession;

  /** Current connection of SSX */
  public connection?: SSXConnected;

  /** Supported RPC Providers */
  public static RPCProviders = SSXRPCProviders;

  constructor(private config: SSXConfig = SSX_DEFAULT_CONFIG) {
    this.init = new SSXInit({ ...this.config, providers: { ...SSX_DEFAULT_CONFIG.providers, ...this.config?.providers } });

    if (this.config.enableDaoLogin) {
      const gnosis = new GnosisDelegation();
      this.init.extend(gnosis);
    }
  }

  /** 
   * Request the user to sign in, and start the session. 
   * @param signInOpts - Additional options to customize sign-in behavior
   * @returns Object containing information about the session and ENS (depending on signInOpts param)
   */
  async signIn(
    signInOpts: {
      /* Enables ENS Domain resolution on client side */
      resolveEnsDomain?: boolean,
      /* Enables ENS Avatar resolution on client side */
      resolveEnsAvatar?: boolean,
    } = {}
  ): Promise<SSXSession> {
    try {
      this.connection = await this.init.connect();
    } catch (err) {
      // Something went wrong when connecting or creating Session (wasm)
      console.error(err);
      throw err;
    }

    try {
      this.session = await this.connection.signIn();
      const ens = await this.resolveEns({
        resolveEnsDomain: signInOpts.resolveEnsDomain,
        resolveEnsAvatar: signInOpts.resolveEnsAvatar
      });
      this.session.ens = {
        ...this.session.ens,
        ...ens
      };
      return this.session;
    } catch (err) {
      // Request to /ssx-login went wrong
      console.error(err);
      throw err;
    }
  }

  /**
   * ENS data supported by SSX. 
   * @param resolveEnsOpts - Options to resolve ENS.
   * @returns Object containing ENS data.
   */
  async resolveEns(
    resolveEnsOpts: {
      /* Enables ENS domain/name resolution */
      resolveEnsDomain?: boolean,
      /* Enables ENS avatar resolution */
      resolveEnsAvatar?: boolean,
    } = {
        resolveEnsDomain: true,
        resolveEnsAvatar: true
      }
  ): Promise<SSXEnsData> {
    const { address } = this.session;
    if (!address) {
      throw new Error('Address not found in session data.');
    }
    let ens: SSXEnsData = {};
    let promises: Array<Promise<any>> = [];
    if (resolveEnsOpts?.resolveEnsDomain) {
      promises.push(this.connection.provider.lookupAddress(address))
    }
    if (resolveEnsOpts?.resolveEnsAvatar) {
      promises.push(this.connection.provider.getAvatar(address))
    }

    await Promise.all(promises)
      .then(([ensName, ensAvatarUrl]) => {
        if (!resolveEnsOpts.resolveEnsDomain && resolveEnsOpts.resolveEnsAvatar) {
          [ensName, ensAvatarUrl] = [undefined, ensName];
        }
        if (ensName) {
          ens['ensName'] = ensName;
        }
        if (ensAvatarUrl) {
          ens['ensAvatarUrl'] = ensAvatarUrl;
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

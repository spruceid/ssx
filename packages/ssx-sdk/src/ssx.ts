import { GnosisDelegation } from '@spruceid/ssx-gnosis-extension';
import {
  SSXConnected,
  SSXInit,
} from './core';
import {
  SSXConfig,
  SSXSession,
  SSXRPCProviders,
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
  private session?: SSXSession;

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

  /** Request the user to sign in, and start the session. */
  async signIn(): Promise<SSXSession> {
    try {
      this.connection = await this.init.connect();
    } catch (err) {
      // Something went wrong when connecting or creating Session (wasm)
      console.error(err);
      throw err;
    }

    try {
      this.session = await this.connection.signIn();
      return this.session;
    } catch (err) {
      // Request to /ssx-login went wrong
      console.error(err);
      throw err;
    }
  }

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

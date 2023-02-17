import { GnosisDelegation } from '@spruceid/ssx-gnosis-extension';
import { SSXConnected, SSXInit } from './core';
import {
  SSXRPCProviders,
  SSXEnsData,
  SSXEnsResolveOptions,
  ssxResolveEns,
  ssxResolveLens,
  SSXLensProfilesResponse,
} from '@spruceid/ssx-core';
import {
  SSXClientConfig,
  SSXClientSession,
  SSXExtension,
} from '@spruceid/ssx-core/client';
import type { ethers } from 'ethers';
declare global {
  interface Window {
    ethereum?: any;
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

  /** The Ethereum provider */
  public provider: ethers.providers.Web3Provider;

  /** The session representation (once signed in). */
  public session?: SSXClientSession;

  /** Current connection of SSX */
  public connection?: SSXConnected;

  /** Supported RPC Providers */
  public static RPCProviders = SSXRPCProviders;

  constructor(private config: SSXClientConfig = SSX_DEFAULT_CONFIG) {
    this.init = new SSXInit({
      ...this.config,
      providers: { ...SSX_DEFAULT_CONFIG.providers, ...this.config?.providers },
    });

    if (this.config.enableDaoLogin) {
      const gnosis = new GnosisDelegation();
      this.init.extend(gnosis);
    }
  }

  /**
   * Extends SSX with a functions that are called after connecting and signing in.
   */
  public extend(extension: SSXExtension): void {
    this.init.extend(extension);
  }

  /**
   * Connects the SSX instance to the Ethereum provider.
   */
  public async connect(): Promise<void> {
    if (this.connection) {
      return;
    }
    try {
      this.connection = await this.init.connect();
      this.provider = this.connection.provider;
    } catch (err) {
      // ERROR:
      // Something went wrong when connecting or creating Session (wasm)
      console.error(err);
      throw err;
    }
  }

  /**
   * Request the user to sign in, and start the session.
   * @returns Object containing information about the session
   */
  public async signIn(): Promise<SSXClientSession> {
    await this.connect();

    try {
      this.session = await this.connection.signIn();
    } catch (err) {
      // Request to /ssx-login went wrong
      console.error(err);
      throw err;
    }
    const promises = [];

    let resolveEnsOnClient = false;
    if (this.config.resolveEns) {
      if (this.config.resolveEns === true) {
        resolveEnsOnClient = true;
        promises.push(this.resolveEns(this.session.address));
      } else if (!this.config.resolveEns.resolveOnServer) {
        resolveEnsOnClient = true;

        promises.push(this.resolveEns(
          this.session.address,
          this.config.resolveEns.resolve
        ));
      }
    }

    const resolveLensOnClient = (this.config.resolveLens === true);
    if (resolveLensOnClient) {
      promises.push(this.resolveLens(this.session.address))
    }

    await Promise.all(promises).then(([ens, lens]) => {
      if (!resolveEnsOnClient && resolveLensOnClient) {
        [ens, lens] = [undefined, ens];
      }
      if (ens) {
        this.session.ens = ens;
      }
      if (lens) {
        this.session.lens = lens;
      }
    });

    return this.session;
  }

  /**
   * ENS data supported by SSX.
   * @param address - User address.
   * @param resolveEnsOpts - Options to resolve ENS.
   * @returns Object containing ENS data.
   */
  public async resolveEns(
    /** User address */
    address: string,
    resolveEnsOpts: SSXEnsResolveOptions = {
      domain: true,
      avatar: true,
    }
  ): Promise<SSXEnsData> {
    return ssxResolveEns(this.connection.provider, address, resolveEnsOpts);
  }

  /**
   * Resolves Lens profiles owned by the given Ethereum Address. Each request is 
   * limited by 10. To get other pages you must to pass the pageCursor parameter.
   * 
   * Lens profiles can be resolved on the Polygon Mainnet (matic) or Mumbai Testnet
   * (maticmum). Visit https://docs.lens.xyz/docs/api-links for more information.
   *  
   * @param address - Ethereum User address.
   * @param pageCursor - Page cursor used to paginate the request. Default to 
   * first page. Visit https://docs.lens.xyz/docs/get-profiles#api-details for more 
   * information.
   * @returns Object containing Lens profiles items and pagination info.
   */
  async resolveLens(
    /* Ethereum User Address. */
    address: string,
    /* Page cursor used to paginate the request. Default to first page. */
    pageCursor: string = "{}"
  ): Promise<string | SSXLensProfilesResponse> {
    return ssxResolveLens(this.connection.provider, address, pageCursor);
  }

  /**
   * Invalidates user's session.
   */
  public async signOut(): Promise<void> {
    try {
      await this.connection.signOut(this.session);
    } catch (err) {
      // request to /ssx-logout went wrong
      console.error(err);
      throw err;
    }
    this.session = null;
    this.connection = null;
  }

  /**
   * Gets the address that is connected and signed in.
   * @returns Address.
   */
  public address: () => string | undefined = () => this.session?.address;

  /**
   * Get the chainId that the address is connected and signed in on.
   * @returns chainId.
   */
  public chainId: () => number | undefined = () => this.session?.chainId;
}

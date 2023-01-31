import { SSXConnected, SSXInit } from './core';
import {
  SSXRPCProviders,
  SSXEnsData,
  SSXEnsResolveOptions,
  SSXLensProfilesResponse,
} from '@spruceid/ssx-core';
import { SSXClientConfig, SSXClientSession } from '@spruceid/ssx-core/client';

import type {
  IUserAuthorization,
  IEncryption,
  IDataVault,
  ICredential,
} from './modules';
import {
  UserAuthorization,
  BrowserDataVault,
  SignatureEncryption,
  Credential,
} from './modules';

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

  /** The session representation (once signed in). */
  public session?: SSXClientSession;

  /** Current connection of SSX */
  public connection?: SSXConnected;

  /** Supported RPC Providers */
  public static RPCProviders = SSXRPCProviders;

  /** UserAuthorization Module
   *
   * Handles the capabilities that a user can provide a dapp, specifically
   * authentication and authorization. This resource handles all key and
   * signing capabilities including:
   * - ethereum provider, wallet connection, SIWE message creation and signing
   * - session key management
   * - creates, manages, and handles session data
   * - manages/provides capabilities
   */
  public userAuthorization: IUserAuthorization;

  /** Encryption Module */
  public encryption: IEncryption;

  /** DataVault Module */
  public dataVault: IDataVault;

  /** Credential Module */
  public credential: ICredential;

  constructor(private config: SSXClientConfig = SSX_DEFAULT_CONFIG) {
    // TODO: initialize these based on the config
    this.userAuthorization = new UserAuthorization(config);
    this.encryption = new SignatureEncryption({}, this.userAuthorization);
    this.dataVault = new BrowserDataVault({}, this.encryption);
    this.credential = new Credential({}, this.dataVault);
  }

  /**
   * Request the user to sign in, and start the session.
   * @returns Object containing information about the session
   */
  public signIn = async (): Promise<SSXClientSession> => {
    return this.userAuthorization.signIn();
  };

  /**
   * Invalidates user's session.
   */
  public signOut = async (): Promise<void> => {
    return this.userAuthorization.signOut();
  };

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
    return this.userAuthorization.resolveEns(address, resolveEnsOpts);
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
    pageCursor = '{}'
  ): Promise<string | SSXLensProfilesResponse> {
    return this.userAuthorization.resolveLens(address, pageCursor);
  }


  /**
   * Gets the address that is connected and signed in.
   * @returns Address.
   */
  public address: () => string | undefined = () =>
    this.userAuthorization.address();

  /**
   * Get the chainId that the address is connected and signed in on.
   * @returns chainId.
   */
  public chainId: () => number | undefined = () =>
    this.userAuthorization.chainId();
}

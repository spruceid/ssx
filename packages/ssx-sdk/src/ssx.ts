import {
  SSXRPCProviders,
  SSXEnsData,
  SSXEnsResolveOptions,
  SSXLensProfilesResponse,
} from '@spruceid/ssx-core';
import {
  Credentials,
  ICredentials,
  IUserAuthorization,
  KeplerStorage,
  UserAuthorization,
} from './modules';
import {
  SSXClientConfig,
  SSXClientSession,
  SSXExtension,
} from '@spruceid/ssx-core/client';
import type { providers, Signer } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

/**
 * Configuration for managing SSX Modules
 */
interface SSXModuleConfig {
  storage?: boolean | { [key: string]: any };
  credentials?: boolean;
}

// temporary: will move to ssx-core
interface SSXConfig extends SSXClientConfig {
  modules?: SSXModuleConfig;
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
  /** The Ethereum provider */
  public provider: providers.Web3Provider;

  /** Supported RPC Providers */
  public static RPCProviders = SSXRPCProviders;

  /** UserAuthorization Module
   *
   * Handles the capabilities that a user can provide a app, specifically
   * authentication and authorization. This resource handles all key and
   * signing capabilities including:
   * - ethereum provider, wallet connection, SIWE message creation and signing
   * - session key management
   * - creates, manages, and handles session data
   * - manages/provides capabilities
   */
  public userAuthorization: IUserAuthorization;

  /** Storage Module */
  public storage: KeplerStorage;

  /** Credentials Module */
  public credentials: ICredentials;

  constructor(private config: SSXConfig = SSX_DEFAULT_CONFIG) {
    // TODO: pull out config validation into separate function
    // TODO: pull out userAuthorization config
    this.userAuthorization = new UserAuthorization(config);

    // initialize storage module
    // assume credentials is **disabled** if config.credentials is not defined
    const credentialsConfig =
      config?.modules?.credentials === undefined ? false : config.modules.credentials;

    // assume storage module is **disabled** if config.storage is not defined
    const storageConfig =
      config?.modules?.storage === undefined ? false : config.modules.storage;

    if (storageConfig !== false) {
      if (typeof storageConfig === 'object') {
        storageConfig.credentialsModule = credentialsConfig;
        // Initialize storage with the provided config
        this.storage = new KeplerStorage(storageConfig, this.userAuthorization);
      } else {
        // storage == true or undefined
        // Initialize storage with default config when no other condition is met
        this.storage = new KeplerStorage(
          { prefix: 'ssx', credentialsModule: credentialsConfig },
          this.userAuthorization
        );
      }
      this.extend(this.storage);
    }

    if (credentialsConfig) {
      // Credentials module depends on the storage module. If it isn't enabled
      // we won't initialize the credentials module.
      if (!storageConfig) {
        throw new Error('You must enable the storage module to use the credentials module.')
      } else {
        this.credentials = new Credentials(this.storage);
        this.extend(this.credentials);
      }
    }
  }

  /**
   * Extends SSX with a functions that are called after connecting and signing in.
   */
  public extend(extension: SSXExtension): void {
    this.userAuthorization.extend(extension);
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
   * Gets the session representation (once signed in).
   * @returns Address.
   */
  public session: () => SSXClientSession | undefined = () =>
    this.userAuthorization.session;

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

  /**
   * Gets the provider that is connected and signed in.
   * @returns Provider.
   */
  public getProvider(): providers.Web3Provider | undefined {
    return this.userAuthorization.provider;
  }

  /**
   * Returns the signer of the connected address.
   * @returns ethers.Signer
   * @see https://docs.ethers.io/v5/api/signer/#Signer
   */
  public getSigner(): Signer {
    return this.userAuthorization.provider.getSigner();
  }
}

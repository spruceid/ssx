import {
  SSXRPCProviders,
  SSXEnsData,
  SSXEnsResolveOptions,
  SSXLensProfilesResponse,
} from '@spruceid/ssx-core';

import {
  IUserAuthorization,
  IEncryption,
  IDataVault,
  ICredential,
  UserAuthorizationConnected,
  UserAuthorizationInit,
  BrowserStorage,
  IStorage,
  KeplerDataVault,
  KeplerStorage,
} from './modules';
import {
  SSXClientConfig,
  SSXClientSession,
  SSXExtension,
} from '@spruceid/ssx-core/client';
import type { ethers } from 'ethers';
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

interface SSXEncryptionModuleConfig {
  module: 'SignatureEncryption' | 'LitEncryption';
}

interface SignatureEncryptionConfig extends SSXEncryptionModuleConfig {
  module: 'SignatureEncryption';
  /**
   * A message used to generate the detereministic signature for deriving the encryption key.
   * @default "Sign this message to generate an encryption key for {address}"
   */
  message?: () => string;
}

/**
 * Configuration for managing SSX Modules
 */
interface SSXModuleConfig {
  encryption?: boolean | SSXEncryptionModuleConfig;
  storage?: boolean | { [key: string]: any };
  dataVault?: boolean | { [key: string]: any };
  // encryption?: boolean | SSXEncryptionModuleConfig | (() => IEncryption);
  // storage?: boolean | { [key: string]: any } | (() => IStorage);
  // dataVault?: boolean | { [key: string]: any } | (() => IDataVault);
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
  public provider: ethers.providers.Web3Provider;

  /** The session representation (once signed in). */
  public session?: SSXClientSession;

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

  /** Storage Module */
  public storage: IStorage;

  constructor(private config: SSXConfig = SSX_DEFAULT_CONFIG) {
    // TODO: pull out config validation into separate function
    // TODO: pull out userAuthorization config
    this.userAuthorization = new UserAuthorization(config);

    // credential module disabled for now
    // this.credential = new Credential({}, this.dataVault);

    // initialize encryption module
    // assume encryption module is **enabled** if config.encryption is not defined
    const encryptionConfig =
      config?.modules?.encryption === undefined
        ? true
        : config.modules.encryption;
    if (encryptionConfig !== false) {
      if (typeof encryptionConfig === 'object') {
        // determine which encryption module to use
        // initialize encryption with the provided config
        if (encryptionConfig.module === 'SignatureEncryption') {
          this.encryption = new SignatureEncryption(
            encryptionConfig,
            this.userAuthorization
          );
        } else {
          throw new Error(
            `Encryption module ${encryptionConfig.module} not supported`
          );
        }
        // } else if (typeof encryptionConfig === 'function') {
        //   // Initialize encryption with the return from the provided function
        //   this.encryption = encryptionConfig();
      } else {
        // encryption == true or undefined
        // Initialize encryption with default config when no other condition is met
        this.encryption = new SignatureEncryption({}, this.userAuthorization);
      }
      // IEncryption does not yet extend ISSXExtension
      // this.extend(this.encryption);
    }

    // initialize storage module
    // assume storage module is **enabled** if config.storage is not defined
    const storageConfig =
      config?.modules?.storage === undefined ? true : config.modules.storage;
    if (storageConfig !== false) {
      if (typeof storageConfig === 'object') {
        // Initialize storage with the provided config
        this.storage = new KeplerStorage(storageConfig, this.userAuthorization);
        // } else if (typeof storageConfig === 'function') {
        //   // Initialize storage with the return from the provided function
        //   this.storage = config.modules.storage();
      } else {
        // storage == true or undefined
        // Initialize storage with default config when no other condition is met
        this.storage = new KeplerStorage(
          { prefix: 'ssx' },
          this.userAuthorization
        );
      }
      this.extend(this.storage);
    }

    // initialize data vault module
    // assume data vault is **disabled** if config.dataVault is not defined
    const dataVaultConfig =
      config?.modules?.dataVault === undefined ? false : config.modules.dataVault;
    if (dataVaultConfig !== false) {
      if (typeof dataVaultConfig === 'object') {
        // Initialize data vault with the provided config
        this.dataVault = new KeplerDataVault(
          dataVaultConfig,
          this.userAuthorization,
          this.encryption
        );
        // } else if (typeof dataVaultConfig === 'function') {
        //   // Initialize data vault with the return from the provided function
        //   this.dataVault = dataVaultConfig();
      } else {
        // dataVault == true or undefined
        // Initialize data vault with default config when no other condition is met
        this.dataVault = new KeplerDataVault(
          { prefix: 'ssx' },
          this.userAuthorization,
          this.encryption
        );
      }
      this.extend(this.dataVault);
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

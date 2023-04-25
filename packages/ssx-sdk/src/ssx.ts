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
  LitEncryption,
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

interface LitEncryptionConfig extends SSXEncryptionModuleConfig {
  module: 'LitEncryption';
}

/**
 * Configuration for managing SSX Modules
 */
interface SSXModuleConfig {
  encryption: boolean | SSXEncryptionModuleConfig | IEncryption;
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
    // TODO: initialize these based on the config
    this.userAuthorization = new UserAuthorization(config);
    // get encryption config from config.modules.encryption
    // determine which encryption module to use
    // if encryption module is false, don't initialize encryption or dependent modules
    if (
      this.config?.modules?.encryption === true ||
      (this.config?.modules?.encryption as SSXEncryptionModuleConfig)?.module === 'SignatureEncryption'
    ) {
      this.encryption = new SignatureEncryption({}, this.userAuthorization);
    } else if ((this.config?.modules?.encryption as SSXEncryptionModuleConfig)?.module === 'LitEncryption') {
      this.encryption = new LitEncryption({}, this.userAuthorization);
    }
    this.dataVault = new BrowserDataVault({}, this.encryption);
    this.credential = new Credential({}, this.dataVault);
    this.storage = new BrowserStorage({});
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

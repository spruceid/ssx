import { SSXClientSession, SSXExtension } from '@spruceid/ssx-core/client';
import type { Request, Response, Session } from './kepler';

/**
 * @interface IStorageBaseOptions
 * @property prefix - Optional string identifying the folder in the storage.
 * @property request - Optional request object to use for the operation.
 */
export interface IStorageBaseOptions {
  prefix?: string;
  request?: Request;
}

/**
 * @interface IStorageGetOptions
 * @property prefix - Optional string identifying the folder in the storage.
 * @property request - Optional request object to use for the operation.
 */
export interface IStorageGetOptions extends IStorageBaseOptions {}

/**
 * @interface IStoragePutOptions
 * @property prefix - Optional string identifying the folder in the storage.
 * @property request - Optional request object to use for the operation.
 */
export interface IStoragePutOptions extends IStorageBaseOptions {}

/**
 * @interface IStorageDeleteOptions
 * @property prefix - Optional string identifying the folder in the storage.
 * @property request - Optional request object to use for the operation.
 */
export interface IStorageDeleteOptions extends IStorageBaseOptions {}

/**
 * @interface IStorageListOptions
 * @property prefix - Optional string identifying the folder in the storage.
 * @property path - Optional string identifying the path to be combined with the prefix in the storage.
 * @property removePrefix - Optional boolean to remove the prefix from the file names.
 * @property request - Optional request object to use for the operation.
 */
export interface IStorageListOptions extends IStorageBaseOptions {
  path?: string;
  removePrefix?: boolean;
}

/**
 * Represents a storage interface that defines basic storage operations.
 */
interface IStorage extends SSXExtension {
  /**
   * Retrieves the stored value associated with the specified key.
   * @param key - The unique identifier for the stored value.
   * @param options - IStorageGetOptions object.
   * @returns A Promise that resolves to the value associated with the given key or undefined if the key does not exist.
   */
  get(key: string, options?: IStorageGetOptions): Promise<Response>;

  /**
   * Stores a value with the specified key.
   * @param key - The unique identifier for the stored value.
   * @param value - The value to store under the given key.
   * @param options - IStoragePutOptions object.
   * @returns A Promise that resolves when the operation is complete.
   */
  put(key: string, value: any, options?: IStoragePutOptions): Promise<Response>;

  /**
   * Lists all keys currently stored in the storage.
   * @returns A Promise that resolves to an array of strings representing the stored keys.
   */
  list(): Promise<Response>;

  /**
   * Lists all keys currently stored in the storage.
   * @param options - IStorageListOptions object.
   * @returns A Promise that resolves to an array of strings representing the stored keys.
   */
  list(options?: IStorageListOptions): Promise<Response>;

  /**
   * Deletes the stored value associated with the specified key.
   * @param key - The unique identifier for the stored value to be deleted.
   * @param options - IStorageDeleteOptions object.
   * @returns A Promise that resolves when the operation is complete.
   */
  delete(key: string, options?: IStorageListOptions): Promise<Response>;

  /**
   * Deletes all stored key-value pairs in the storage.
   * @param prefix - String identifying the folder in the storage.
   * @returns A Promise that resolves when the operation is complete.
   */
  deleteAll(prefix?: string): Promise<Response[]>;
}

// TODO: Document this interface
export interface IKepler extends IStorage {
  hostOrbit(ssxSession?: SSXClientSession): Promise<void>;
  activateSession(
    ssxSession?: SSXClientSession,
    onError?: () => void
  ): Promise<boolean>;
  generateSharingLink(key: string, params?: any): Promise<string>;
  retrieveSharingLink(link: string): Promise<Response>;
  generateKeplerSession(ssxSession: SSXClientSession): Promise<Session>;
}

/**
 * Represents a storage configuration object with an optional prefix.
 */
interface IStorageConfig {
  prefix?: string;
}

/**
 * Represents a Kepler storage configuration object that extends IStorageConfig.
 */
interface IKeplerStorageConfig extends IStorageConfig {
  /**
   * The Kepler Peer to connect to
   * @default 'https://kepler.spruceid.xyz'
   */
  hosts?: string[];
  /**
   * Automatically create a new orbit if one does not exist.
   * If this is false, you will need to manually create an orbit before using
   * the storage operations on KeplerDataVault.
   * @default true
   */
  autoCreateNewOrbit?: boolean;
}

export { IStorage, IStorageConfig, IKeplerStorageConfig };

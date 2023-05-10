import { SSXExtension } from '@spruceid/ssx-core/client';

/**
 * Represents a storage interface that defines basic storage operations.
 */
interface IStorage extends SSXExtension {
  /**
   * Retrieves the stored value associated with the specified key.
   * @param key - The unique identifier for the stored value.
   * @returns A Promise that resolves to the value associated with the given key or undefined if the key does not exist.
   */
  get(key: string): Promise<any>;

  /**
   * Stores a value with the specified key.
   * @param key - The unique identifier for the stored value.
   * @param value - The value to store under the given key.
   * @returns A Promise that resolves when the operation is complete.
   */
  put(key: string, value: any): Promise<void>;

  /**
   * Lists all keys currently stored in the storage.
   * @returns A Promise that resolves to an array of strings representing the stored keys.
   */
  list(): Promise<string[]>;

  /**
   * Deletes the stored value associated with the specified key.
   * @param key - The unique identifier for the stored value to be deleted.
   * @returns A Promise that resolves when the operation is complete.
   */
  delete(key: string): Promise<void>;

  /**
   * Deletes all stored key-value pairs in the storage.
   * @returns A Promise that resolves when the operation is complete.
   */
  deleteAll(): Promise<void>;
}

/**
 * Represents an extended storage interface that includes encrypted storage operations.
 */
interface IDataVault extends IStorage {
  /**
   * Retrieves the unencrypted stored value associated with the specified key.
   * @param key - The unique identifier for the stored value.
   * @returns A Promise that resolves to the unencrypted value associated with the given key or undefined if the key does not exist.
   */
  unencrypted_get(key: string): Promise<any>;

  /**
   * Stores a value without encryption with the specified key.
   * @param key - The unique identifier for the stored value.
   * @param value - The value to store under the given key without encryption.
   * @returns A Promise that resolves when the operation is complete.
   */
  unencrypted_put(key: string, value: any): Promise<void>;

  /**
   * Retrieves the encrypted stored value associated with the specified key, decrypting it before returning.
   * @param key - The unique identifier for the stored value.
   * @returns A Promise that resolves to the decrypted value associated with the given key or undefined if the key does not exist.
   */
  get(key: string): Promise<any>;

  /**
   * Stores a value with the specified key, encrypting it before storage.
   * @param key - The unique identifier for the stored value.
   * @param value - The value to store under the given key with encryption.
   * @returns A Promise that resolves when the operation is complete.
   */
  put(key: string, value: any): Promise<void>;
}

/**
 * Represents a storage configuration object with an optional prefix.
 */
interface IStorageConfig {
  prefix?: string;
}

/**
 * Represents a browser storage configuration object that extends IStorageConfig.
 */
interface IBrowserStorageConfig extends IStorageConfig {
  storeName?: string;
}

/**
 * Represents a Kepler storage configuration object that extends IStorageConfig.
 */
interface IKeplerStorageConfig extends IStorageConfig {
  host?: string;
}

export {
  IStorage,
  IDataVault,
  IStorageConfig,
  IBrowserStorageConfig,
  IKeplerStorageConfig,
};

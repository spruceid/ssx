import { openDB, IDBPDatabase } from 'idb';
import { IEncryption } from './Encryption';
import { IUserAuthorization } from './UserAuthorization';

/**
 * Represents a storage interface that defines basic storage operations.
 */
interface IStorage {
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
 * Represents a class for managing browser storage operations.
 */
class BrowserStorage implements IStorage {
  private prefix: string;
  private dbName: string;
  private storeName: string;

  /**
   * Constructs a new instance of BrowserStorage.
   * @param config - An object containing optional configuration properties for browser storage.
   */
  constructor(config: IBrowserStorageConfig) {
    // if no window object, throw error
    if (typeof window === 'undefined') {
      throw new Error('BrowserStorage: window object not found');
    }

    this.prefix = config?.prefix || '';
    this.dbName = 'ssx-browser-storage';
    this.storeName = config?.storeName || 'ssx-browser-storage-store';
  }

  /**
  * Prefixes the provided key based on the stored prefix.
  * @param key - The key to be prefixed.
  * @returns The prefixed key.
  */
  private prefixKey(key: string): string {
    return this.prefix ? `${this.prefix}/${key}` : key;
  }

  /**
   * Retrieves the underlying IDBPDatabase instance.
   * @returns A Promise that resolves to the IDBPDatabase instance.
   */
  private async getDB(): Promise<IDBPDatabase> {
    const storeName = this.storeName;
    return await openDB(this.dbName, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      },
    });
  }

  public async get(key: string): Promise<any> {
    const db = await this.getDB();
    const transaction = db.transaction(this.storeName, 'readonly');
    const store = transaction.objectStore(this.storeName);
    const value = await store.get(this.prefixKey(key));
    await transaction.done;
    return value;
  }

  public async put(key: string, value: any): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction(this.storeName, 'readwrite');
    const store = transaction.objectStore(this.storeName);
    await store.put(value, this.prefixKey(key));
    await transaction.done;
  }

  public async list(): Promise<string[]> {
    const db = await this.getDB();
    const transaction = db.transaction(this.storeName, 'readonly');
    const store = transaction.objectStore(this.storeName);
    const keys = await store.getAllKeys();
    await transaction.done;
    return keys as unknown as string[];
  }

  public async delete(key: string): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction(this.storeName, 'readwrite');
    const store = transaction.objectStore(this.storeName);
    await store.delete(this.prefixKey(key));
    await transaction.done;
  }

  public async deleteAll(): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction(this.storeName, 'readwrite');
    const store = transaction.objectStore(this.storeName);
    await store.clear();
    await transaction.done;
  }
}

/**
 * Represents a class for managing browser storage operations with encryption.
 */
class BrowserDataVault extends BrowserStorage implements IDataVault {
  private encryption: IEncryption;
  /**
   * Constructs a new instance of BrowserDataVault.
   * @param config - An object containing optional configuration properties for browser storage.
   * @param encryption - An instance of an object that implements IEncryption for encryption and decryption operations.
   */
  constructor(config: any, encryption: IEncryption) {
    super(config);
    this.encryption = encryption;
  }

  /**
   * Retrieves the encrypted stored value for the specified key,
   * decrypts it, and returns the decrypted value.
   * @param key - The unique identifier for the stored value.
   * @returns A Promise that resolves to the decrypted value associated
   * with the given key or null if the key does not exist.
   */
  public async get(key: string): Promise<any> {
    const encryptedData = await super.get(key);
    if (encryptedData) {
      return this.encryption.decrypt(encryptedData);
    }
    return null;
  }

  /**
   * Stores a value with the specified key, encrypting it before storage.
   * @param key - The unique identifier for the stored value.
   * @param value - The value to store under the given key with encryption.
   * @returns A Promise that resolves when the operation is complete.
   */
  public async put(key: string, value: any): Promise<void> {
    const encryptedData = await this.encryption.encrypt(value);
    return super.put(key, encryptedData);
  }

  /**
   * Retrieves the unencrypted stored value associated with the specified key.
   * @param key - The unique identifier for the stored value.
   * @returns A Promise that resolves to the unencrypted value associated with the given key or undefined if the key does not exist.
   */
  public unencrypted_get(key: string): Promise<any> {
    return super.get(key);
  }

  /**
   * Stores a value without encryption with the specified key.
   * @param key - The unique identifier for the stored value.
   * @param value - The value to store under the given key without encryption.
   * @returns A Promise that resolves when the operation is complete.
   */
  public unencrypted_put(key: string, value: any): Promise<void> {
    return super.put(key, value);
  }
}

// class KeplerDataVault implements IDataVault {
//   private userAuth: IUserAuthorization;
//   private encryption: IEncryption;

//   constructor(
//     config: any,
//     userAuth: IUserAuthorization,
//     encryption: IEncryption
//   ) {
//     this.userAuth = userAuth;
//     this.encryption = encryption;
//   }
// }

// // Example usage
// const jsonData = {
//   name: "John Doe",
//   age: 30,
//   hobbies: ["reading", "hiking"],
// };

// const blob = blobify(jsonData);
// console.log("Blob:", blob);

// (async () => {
//   const parsedData = await unblobify(blob);
//   console.log("Parsed data:", parsedData);
// })();

export {
  IStorage,
  IDataVault,
  BrowserStorage,
  BrowserDataVault,
  // KeplerDataVault,
};

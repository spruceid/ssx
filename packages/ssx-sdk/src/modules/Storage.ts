import { openDB, IDBPDatabase } from 'idb';
import { IEncryption } from './Encryption';
import { IUserAuthorization } from './UserAuthorization';

interface IStorage {
  /**
   * Retrieves the stored value for the specified key.
   * @param key The unique identifier for the stored value.
   * @returns The value associated with the given key, or undefined if the key does not exist.
   */
  get(key: string): Promise<any>;

  /**
   * Stores a value with the specified key.
   * @param key The unique identifier for the stored value.
   * @param value The value to store under the given key.
   */
  put(key: string, value: any): Promise<void>;

  /**
   * Lists all keys currently stored in the storage.
   * @returns An array of strings representing the stored keys.
   */
  list(): Promise<string[]>;

  /**
   * Deletes the stored value for the specified key.
   * @param key The unique identifier for the stored value to be deleted.
   */
  delete(key: string): Promise<void>;

  /**
   * Deletes all stored key-value pairs in the storage.
   */
  deleteAll(): Promise<void>;
}

interface IDataVault extends IStorage {
  /**
   * Retrieves the unencrypted stored value for the specified key.
   * @param key The unique identifier for the stored value.
   * @returns The unencrypted value associated with the given key, or undefined if the key does not exist.
   */
  unencrypted_get(key: string): Promise<any>;

  /**
   * Stores a value without encryption with the specified key.
   * @param key The unique identifier for the stored value.
   * @param value The value to store under the given key without encryption.
   */
  unencrypted_put(key: string, value: any): Promise<void>;

  /**
   * Retrieves the encrypted stored value for the specified key, decrypting it before returning.
   * @param key The unique identifier for the stored value.
   * @returns The decrypted value associated with the given key, or undefined if the key does not exist.
   */
  get(key: string): Promise<any>;

  /**
   * Stores a value with the specified key, encrypting it before storage.
   * @param key The unique identifier for the stored value.
   * @param value The value to store under the given key with encryption.
   */
  put(key: string, value: any): Promise<void>;
}

interface IStorageConfig {
  prefix?: string;
}

interface IBrowserStorageConfig extends IStorageConfig {
  storeName?: string;
}

class BrowserStorage implements IStorage {
  private prefix: string;
  private dbName: string;
  private storeName: string;

  constructor(config: IBrowserStorageConfig) {
    // if no window object, throw error
    if (typeof window === 'undefined') {
      throw new Error('BrowserStorage: window object not found');
    }

    this.prefix = config?.prefix || '';
    this.dbName = 'ssx-browser-storage';
    this.storeName = config?.storeName || 'ssx-browser-storage-store';
  }

  private prefixKey(key: string): string {
    return this.prefix ? `${this.prefix}/${key}` : key;
  }

  private async getDB(): Promise<IDBPDatabase> {
    return await openDB(this.dbName, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('store')) {
          db.createObjectStore('store');
        }
      },
    });
  }

  public async get(key: string): Promise<any> {
    const db = await this.getDB();
    const tx = db.transaction('store', 'readonly');
    const store = tx.objectStore('store');
    const value = await store.get(this.prefixKey(key));
    await tx.done;
    return value;
  }

  public async put(key: string, value: any): Promise<void> {
    const db = await this.getDB();
    const tx = db.transaction('store', 'readwrite');
    const store = tx.objectStore('store');
    await store.put(value, this.prefixKey(key));
    await tx.done;
  }

  public async list(): Promise<string[]> {
    const db = await this.getDB();
    const tx = db.transaction('store', 'readonly');
    const store = tx.objectStore('store');
    const keys = await store.getAllKeys();
    await tx.done;
    return keys as unknown as string[];
  }

  public async delete(key: string): Promise<void> {
    const db = await this.getDB();
    const tx = db.transaction('store', 'readwrite');
    const store = tx.objectStore('store');
    await store.delete(this.prefixKey(key));
    await tx.done;
  }

  public async deleteAll(): Promise<void> {
    const db = await this.getDB();
    const tx = db.transaction('store', 'readwrite');
    const store = tx.objectStore('store');
    await store.clear();
    await tx.done;
  }
}

// class BrowserDataVault extends BrowserStorage implements IDataVault {
class BrowserDataVault extends BrowserStorage implements IDataVault {
  private encryption: IEncryption;

  constructor(config: any, encryption: IEncryption) {
    super(config);
    this.encryption = encryption;
  }

  // get data and decrypt
  public async get(key: string): Promise<any> {
    const encryptedData = await super.get(key);
    if (encryptedData) {
      return this.encryption.decrypt(encryptedData);
    }
    return null;
  }

  // encrypt data and store
  public async put(key: string, value: any): Promise<void> {
    const encryptedData = await this.encryption.encrypt(value);
    return super.put(key, encryptedData);
  }

  public unencrypted_get(key: string): Promise<any> {
    return super.get(key);
  }

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

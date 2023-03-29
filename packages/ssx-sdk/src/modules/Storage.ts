import { IEncryption } from './Encryption';
import { IUserAuthorization } from './UserAuthorization';

interface IStorage {
  /**
   * Retrieves the stored value for the specified key.
   * @param key The unique identifier for the stored value.
   * @returns The value associated with the given key, or undefined if the key does not exist.
   */
  get(key: string): any;

  /**
   * Stores a value with the specified key.
   * @param key The unique identifier for the stored value.
   * @param value The value to store under the given key.
   */
  put(key: string, value: any): void;

  /**
   * Lists all keys currently stored in the storage.
   * @returns An array of strings representing the stored keys.
   */
  list(): string[];

  /**
   * Deletes the stored value for the specified key.
   * @param key The unique identifier for the stored value to be deleted.
   */
  delete(key: string): void;

  /**
   * Deletes all stored key-value pairs in the storage.
   */
  deleteAll(): void;
}

interface IDataVault extends IStorage {
  /**
   * Retrieves the unencrypted stored value for the specified key.
   * @param key The unique identifier for the stored value.
   * @returns The unencrypted value associated with the given key, or undefined if the key does not exist.
   */
  unencrypted_get(key: string): any;

  /**
   * Stores a value without encryption with the specified key.
   * @param key The unique identifier for the stored value.
   * @param value The value to store under the given key without encryption.
   */
  unencrypted_put(key: string, value: any): void;

  /**
   * Retrieves the encrypted stored value for the specified key, decrypting it before returning.
   * @param key The unique identifier for the stored value.
   * @returns The decrypted value associated with the given key, or undefined if the key does not exist.
   */
  get(key: string): any;

  /**
   * Stores a value with the specified key, encrypting it before storage.
   * @param key The unique identifier for the stored value.
   * @param value The value to store under the given key with encryption.
   */
  put(key: string, value: any): void;
}

class BrowserStorage implements IStorage {
  private prefix: string;

  constructor(config: any) {
    // if no window object, throw error
    if (typeof window === 'undefined') {
      throw new Error('BrowserStorage: window object not found');
    }

    this.prefix = config?.prefix || '';
  }

  private prefixKey(key: string): string {
    return this.prefix ? `${this.prefix}/${key}` : key;
  }

  private dataToStorage(data: any): string {
    return JSON.stringify(data);
  }

  private storageToData(data: string): any {
    return JSON.parse(data);
  }

  public get(key: string): any {
    const stringData = window.localStorage.getItem(this.prefixKey(key));
    if (stringData) {
      return this.storageToData(stringData);
    }
    return null;
  }

  public put(key: string, value: any): void {
    const stringData = this.dataToStorage(value);
    return window.localStorage.setItem(this.prefixKey(key), stringData);
  }

  public list(): string[] {
    const keys = Object.keys(window.localStorage);
    return keys;
  }

  public delete(key: string): void {
    return window.localStorage.removeItem(this.prefixKey(key));
  }

  public deleteAll = (): void => {
    const keys = this.list();
    keys.forEach(key => {
      this.delete(key);
    });
  };
}

// class BrowserDataVault extends BrowserStorage implements IDataVault {
class BrowserDataVault extends BrowserStorage implements IDataVault {
  private encryption: IEncryption;

  constructor(config: any, encryption: IEncryption) {
    super(config);
    this.encryption = encryption;
  }

  // get data and decrypt
  public get(key: string): any {
    const encryptedData = super.get(key);
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

  public unencrypted_get(key: string): any {
    return super.get(key);
  }

  public unencrypted_put(key: string, value: any): void {
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
type JsonBlob = Blob;

// Convert JSON data to a blob
function blobify(jsonData: any): JsonBlob {
  if (typeof jsonData === 'function') {
    throw new Error('Cannot blobify functions');
  }

  const jsonString = JSON.stringify(jsonData);
  const blob = new Blob([jsonString], { type: 'application/json' });
  return blob;
}

// Convert a blob back to JSON data
async function unblobify(blob: JsonBlob): Promise<any> {
  const jsonString = await blob.text();
  return JSON.parse(jsonString);
}

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
  blobify,
  unblobify,
};

import { IDataVault } from './interfaces';
import { IEncryption } from '../Encryption';
import BrowserStorage from './BrowserStorage';

/**
 * Represents a class for managing browser storage operations with encryption.
 */
export class BrowserDataVault extends BrowserStorage implements IDataVault {
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

export default BrowserDataVault;


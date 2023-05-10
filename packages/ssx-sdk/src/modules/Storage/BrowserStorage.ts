import { openDB, IDBPDatabase } from 'idb';
import { IStorage, IBrowserStorageConfig } from './interfaces';

/**
 * Represents a class for managing browser storage operations.
 */
export class BrowserStorage implements IStorage {
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

export default BrowserStorage;

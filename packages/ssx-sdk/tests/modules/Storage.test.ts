import { generateTestingUtils } from 'eth-testing';
import { TextEncoder as TE, TextDecoder as TD } from 'util';

// indexedDB test polyfill
import FDBFactory from 'fake-indexeddb/lib/FDBFactory';
import FDBRequest from 'fake-indexeddb/lib/FDBRequest';
import FDBCursor from 'fake-indexeddb/lib/FDBCursor';
import FDBIndex from 'fake-indexeddb/lib/FDBIndex';
import FDBObjectStore from 'fake-indexeddb/lib/FDBObjectStore';
import FDBTransaction from 'fake-indexeddb/lib/FDBTransaction';
import FDBKeyRange from 'fake-indexeddb/lib/FDBKeyRange';
import FDBDatabase from 'fake-indexeddb/lib/FDBDatabase';

global.indexedDB = new FDBFactory();
global.IDBRequest = FDBRequest;
global.IDBCursor = FDBCursor;
global.IDBIndex = FDBIndex;
global.IDBObjectStore = FDBObjectStore;
global.IDBTransaction = FDBTransaction;
global.IDBKeyRange = FDBKeyRange;
global.IDBDatabase = FDBDatabase;

global.TextEncoder = TE;
global.TextDecoder = TD;

import {
  BrowserDataVault,
  BrowserStorage,
  SignatureEncryption,
  UserAuthorization,
} from '../../src/modules';

const testingUtils = generateTestingUtils({ providerType: 'MetaMask' });

describe('Storage', () => {
  describe('BrowserStorage', () => {
    let storage;
    beforeEach(async () => {
      const storageConfig = {};
      storage = new BrowserStorage(storageConfig);
    });

    afterEach(async () => {
      // Clean up the database after each test
      await storage.deleteAll();
      await indexedDB.deleteDatabase(storage.dbname);
    });

    test('Should be able to create a new storage instance', () => {
      expect(storage).toBeDefined();
    });

    test('Should be able to set and get a value', async () => {
      const data = 'Hello World';
      await storage.put('test', data);
      const result = await storage.get('test');
      expect(result).toEqual(data);
    });

    test('Should return undefined when getting a non-existent key', async () => {
      const result = await storage.get('nonexistent');
      expect(result).toBeFalsy(); // null or undefined
    });

    test('Should be able to list stored keys', async () => {
      await storage.put('key1', 'value1');
      await storage.put('key2', 'value2');
      const keys = await storage.list();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
    });

    test('Should be able to delete a stored key-value pair', async () => {
      await storage.put('toBeDeleted', 'value');
      await storage.delete('toBeDeleted');
      const result = await storage.get('toBeDeleted');
      expect(result).toBeFalsy(); // null or undefined
    });

    test('Should be able to delete all stored key-value pairs', async () => {
      await storage.put('key1', 'value1');
      await storage.put('key2', 'value2');
      await storage.deleteAll();
      const keys = await storage.list();
      expect(keys.length).toEqual(0);
    });
  });

  xdescribe('BrowserDataVault', () => {
    let dataVault: BrowserDataVault;
    // depends on Encryption module
    // TODO: configure UserAuth, Encryption for testing
    const userAuth = new UserAuthorization();
    const encryption = new SignatureEncryption({}, userAuth);
    beforeEach(() => {
      const dataVaultConfig = {};
      dataVault = new BrowserDataVault(dataVaultConfig, encryption);
    });

    test('Should be able to create a new dataVault instance', () => {
      expect(dataVault).toBeDefined();
    });

    test('Should be able to set and get an encrypted value', async () => {
      const data = {
        name: 'John Doe',
        age: 30,
        city: 'New York',
      };
      // console.log(data.arrayBuffer());
      // const arrayBuffer = await data.arrayBuffer();
      // console.log("ArrayBuffer:", arrayBuffer);
      await dataVault.put('test', data);
      const result = await dataVault.get('test');
      expect(result).toEqual(data);
    });

    // test('Should be able to set and get an unencrypted value', async () => {
    //   const data = new Blob(['Unencrypted Data'], { type: 'text/plain' });
    //   await dataVault.unencrypted_put('unencrypted_test', data);
    //   const result = await dataVault.unencrypted_get('unencrypted_test');
    //   const resultText = await result.text();
    //   const dataText = await data.text();
    //   expect(resultText).toEqual(dataText);
    // });

    // test('Should return undefined when getting a non-existent encrypted key', async () => {
    //   const result = await dataVault.get('nonexistent');
    //   expect(result).toBeUndefined();
    // });

    // test('Should return undefined when getting a non-existent unencrypted key', async () => {
    //   const result = await dataVault.unencrypted_get('nonexistent');
    //   expect(result).toBeUndefined();
    // });

    // test('Unencrypted data should not be accessible through encrypted get method', async () => {
    //   const data = new Blob(['Unencrypted Data'], { type: 'text/plain' });
    //   await dataVault.unencrypted_put('unencrypted_test', data);
    //   const result = await dataVault.get('unencrypted_test');
    //   expect(result).not.toEqual(data);
    // });

    // test('Encrypted data should not be accessible through unencrypted get method', async () => {
    //   const data = new Blob(['Encrypted Data'], { type: 'text/plain' });
    //   await dataVault.put('test', data);
    //   const result = await dataVault.unencrypted_get('test');
    //   expect(result).not.toEqual(data);
    // });
  });

  //   describe('Kepler', () => {
  //     let storage;
  //     beforeEach(() => {
  //       storage = new Kepler();
  //     });

  //     test('Should be able to create a new storage instance', () => {
  //       expect(storage).toBeDefined();
  //     });

  //     test('Should be able to set and get a value', async () => {
  //       const data = 'Hello World';
  //       await storage.set('test', data);
  //       const result = await storage.get('test');
  //       expect(result).toEqual(data);
  //     });
  //   });
});

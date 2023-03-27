import { generateTestingUtils } from 'eth-testing';
import { TextEncoder as TE, TextDecoder as TD } from 'util';
global.TextEncoder = TE;
global.TextDecoder = TD;

import {
  BrowserDataVault,
  BrowserStorage,
  SignatureEncryption,
  UserAuthorization,
  blobify,
  unblobify,
} from '../../src/modules';

const testingUtils = generateTestingUtils({ providerType: 'MetaMask' });

describe('Storage', () => {
  describe('BrowserStorage', () => {
    let storage;
    beforeEach(() => {
      const storageConfig = {};
      storage = new BrowserStorage(storageConfig);
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

  describe('BrowserDataVault', () => {
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
      const myJsonObj = {
        name: 'John Doe',
        age: 30,
        city: 'New York',
      };
      const data = blobify(myJsonObj);
      // console.log(data.arrayBuffer());
      // const arrayBuffer = await data.arrayBuffer();
      // console.log("ArrayBuffer:", arrayBuffer);
      await dataVault.put('test', data);
      const result = await dataVault.get('test');
      const resultText = await result.text();
      const dataText = await data.text();
      expect(resultText).toEqual(dataText);
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

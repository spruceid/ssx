import { generateTestingUtils } from 'eth-testing';
import { TextEncoder as TE, TextDecoder as TD } from 'util';
global.TextEncoder = TE;
global.TextDecoder = TD;

import {
  BrowserDataVault,
  SignatureEncryption,
  UserAuthorization,
} from '../../src/modules';

const testingUtils = generateTestingUtils({ providerType: 'MetaMask' });

xdescribe('Storage', () => {
  describe('BrowserDataVault', () => {
    let storage;
    // depends on Encryption module
    // TODO: configure UserAuth, Encryption for testing
    const userAuth = new UserAuthorization();
    const encryption = new SignatureEncryption({}, userAuth);
    beforeEach(() => {
      const storageConfig = {};
      storage = new BrowserDataVault(storageConfig, encryption);
    });

    test('Should be able to create a new storage instance', () => {
      expect(storage).toBeDefined();
    });

    test('Should be able to set and get a value', async () => {
      const data = 'Hello World';
      await storage.set('test', data);
      const result = await storage.get('test');
      expect(result).toEqual(data);
    });
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

import { generateTestingUtils } from 'eth-testing';
import { TextEncoder as TE, TextDecoder as TD } from 'util';
global.TextEncoder = TE;
global.TextDecoder = TD;

import { BrowserDataVault } from '../../src/modules';

const testingUtils = generateTestingUtils({ providerType: 'MetaMask' });
return;
describe('Storage', () => {
  describe('BrowserDataVault', () => {
    let storage;
    beforeEach(() => {
      storage = new BrowserDataVault();
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

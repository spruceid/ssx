import { BrowserStorage } from '../../resources';

describe('Storage', () => {
  describe('BrowserStorage', () => {
    let storage;
    beforeEach(() => {
      storage = new BrowserStorage();
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

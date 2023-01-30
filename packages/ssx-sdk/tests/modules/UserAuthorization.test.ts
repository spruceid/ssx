import { generateTestingUtils } from 'eth-testing';
import { TextEncoder as TE, TextDecoder as TD } from 'util';
global.TextEncoder = TE;
global.TextDecoder = TD;

import { UserAuthorization } from '../../src/modules';

const testingUtils = generateTestingUtils({ providerType: 'MetaMask' });
return;
beforeAll(() => {
  // Manually inject the mocked provider in the window as MetaMask does
  (global.window as any).ethereum = testingUtils.getProvider();
});

describe('UserAuthorization', () => {
  let userAuth;
  beforeEach(() => {
    userAuth = new UserAuthorization();
  });

  describe('Wallet Connection and Signing', () => {
    test('Should create a new UserAuthorization instance', () => {
      expect(userAuth).toBeDefined();
    });

    test('Should expose the web3 provider', async () => {
      const result = await userAuth.getWeb3Provider();
      expect(result).toBeDefined();
    });

    test('Should connect to a wallet', async () => {
      const result = await userAuth.connect();
      expect(result).toBeDefined();
    });

    test('Should sign in using SIWE', async () => {
      const result = await userAuth.signIn();
      expect(result).toBeDefined();
    });

    test('Should be able to get session data', async () => {
      await userAuth.signIn();
      const result = await userAuth.getSessionData();
      expect(result).toBeDefined();
    });

    test('Should be able to sign out', async () => {
      await userAuth.signIn();
      const result = await userAuth.signOut();
      expect(result).toBeDefined();
    });
  });

  // describe('User Capability Management', () => {
  //   test('Should be able to get capabilities', async () => {
  //     // get capabilities as UCAN or CACAO
  //     // helper functions to parse/validate/understand UCANs and CACAOs
  //     await userAuth.signIn();
  //     const result = await userAuth.getCapabilities();
  //     expect(result).toBeDefined();
  //   });

  //   test('Should be able to request capabilities', async () => {
  //     await userAuth.signIn();
  //     const result1 = await userAuth.getCapabilities();
  //     const result2 = await userAuth.requestCapabilities();
  //     expect(result2).toBeDefined();
  //     // expect result 2 capabilities to be different than result 1
  //     // expect result 1 capabilities to be a subset of result 2
  //   });
  // });

});

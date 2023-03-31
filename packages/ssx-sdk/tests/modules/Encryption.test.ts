import { ethers } from 'ethers';
import { generateTestingUtils } from 'eth-testing';
import { TextEncoder as TE, TextDecoder as TD } from 'util';
global.TextEncoder = TE;
global.TextDecoder = TD;

// import crypto from "@trust/webcrypto";
// Object.defineProperty(global.self, "crypto", {
//   ...crypto,
//   value: {
//     ...crypto.subtle,
//     subtle: {
//       importKey: () => new CryptoKey()
//     },
//   },
// });

import {
  SignatureEncryption,
  LitEncryption,
  UserAuthorization,
} from '../../src/modules';

const testingUtils = generateTestingUtils({ providerType: 'MetaMask' });
testingUtils.mockChainId('0x5');
testingUtils.mockConnectedWallet([
  '0x96F7fB7ed32640d9D3a982f67CD6c09fc53EBEF1',
]);

xdescribe('Encryption', () => {
  let encryption;
  // depends on UserAuthorization
  // TODO: configure UserAuth for testing
  const config = {
    providers: {
      web3: {
        driver: new ethers.providers.Web3Provider(testingUtils.getProvider()),
      },
    },
  };
  const userAuth = new UserAuthorization(config);
  userAuth.connect();
  describe('Signature Encryption', () => {
    beforeEach(() => {
      const encryptionConfig = {};
      encryption = new SignatureEncryption(encryptionConfig, userAuth);
    });

    test('Should be able to encrypt and decrypt a message', async () => {
      const data = {
        message: 'Hello World',
      };
      const encryptedData = await encryption.encrypt(data);
      const decryptedData = await encryption.decrypt(encryptedData);
      expect(decryptedData).toEqual(data);
    });
  });

  xdescribe('Lit Encryption', () => {
    beforeEach(() => {
      const encryptionConfig = {};
      encryption = new LitEncryption(encryptionConfig, userAuth);
    });

    test('Should be able to encrypt and decrypt a message', async () => {
      const message = 'Hello World';
      const encryptedMessage = await encryption.encrypt(message);
      const decryptedMessage = await encryption.decrypt(encryptedMessage);
      expect(decryptedMessage).toEqual(message);
    });

    test('Should be able to encrypt and decrypt a message with a symmetric key', async () => {
      const message = 'Hello World';
      const key = '123456789012';
      const encryptedMessage = await encryption.encrypt(message, key);
      const decryptedMessage = await encryption.decrypt(encryptedMessage, key);
      expect(decryptedMessage).toEqual(message);
    });
  });
});

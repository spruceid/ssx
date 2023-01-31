import { generateTestingUtils } from 'eth-testing';
import { TextEncoder as TE, TextDecoder as TD } from 'util';
global.TextEncoder = TE;
global.TextDecoder = TD;

import {
  SignatureEncryption,
  LitEncryption,
  UserAuthorization,
} from '../../src/modules';

const testingUtils = generateTestingUtils({ providerType: 'MetaMask' });

xdescribe('Encryption', () => {
  let encryption;
  // depends on UserAuthorization
  // TODO: configure UserAuth for testing
  const userAuth = new UserAuthorization();

  describe('Signature Encryption', () => {
    beforeEach(() => {
      const encryptionConfig = {};
      encryption = new SignatureEncryption(encryptionConfig, userAuth);
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

  describe('Lit Encryption', () => {
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

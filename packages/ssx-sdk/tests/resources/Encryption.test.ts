import { LitEncryption } from '../../resources';

describe('Encryption', () => {
  let encryption;
  beforeEach(() => {
    encryption = new LitEncryption();
  });

  describe('Lit Encryption', () => {
    test('Should be able to encrypt and decrypt a message', async () => {
      const message = 'Hello World';
      const encryptedMessage = await encryption.encrypt(message);
      const decryptedMessage = await encryption.decrypt(encryptedMessage);
      expect(decryptedMessage).toEqual(message);
    });

    test('Should be able to encrypt and decrypt a message with a key', async () => {
      const message = 'Hello World';
      const key = '123456789012';
      const encryptedMessage = await encryption.encrypt(message, key);
      const decryptedMessage = await encryption.decrypt(encryptedMessage, key);
      expect(decryptedMessage).toEqual(message);
    });
  });
});

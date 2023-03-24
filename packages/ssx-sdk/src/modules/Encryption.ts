import * as jose from 'jose';
import { IUserAuthorization } from './UserAuthorization';

/**
 * The Encryption module handles the encryption and decryption of data.
 * It expects a Blob as input to be encrypted and returns a Blob as output when
 * decrypted.
 *
 * The format encrypted state depends on the implementation.
 */
interface IEncryption {
  /**
   * Encrypts the data. The data is expected to be a Blob.
   * The output type depends on the implementation.
   * @param data - The data to encrypt.
   * @returns The encrypted data.
   */
  encrypt: (data: Blob) => Promise<any>;
  /**
   * Decrypts the data. The encrypted type depends on the implementation. The
   * output returned is a Blob.
   * @param encrypted - The encrypted data to decrypt.
   * @returns - The decrypted data as a blob
   */
  decrypt: (encrypted: any) => Promise<Blob>;
}

class LitEncryption implements IEncryption {
  private userAuth: IUserAuthorization;

  constructor(config: any, userAuth: IUserAuthorization) {
    this.userAuth = userAuth;
  }
  encrypt: (data: Blob) => Promise<any>;
  decrypt: (encrypted: any) => Promise<Blob>;
}

/**
 * The SignatureEncryption module handles the encryption and decryption of data.
 * It uses the user's signature (via UserAuthorization) to derive an encryption
 * key for ECIES encryption.
 *
 * The format encrypted state is a JWE.
 * This module should not be used in production.
 */
class SignatureEncryption implements IEncryption {
  private userAuth: IUserAuthorization;
  private encryptionKey?: any;
  constructor(config: any, userAuth: IUserAuthorization) {
    this.userAuth = userAuth;
  }

  public generateEncryptionKey = async () => {
    if (this.encryptionKey) {
      return;
    }
    // get user signature of message
    const message = `Sign this message to generate an encryption key for ${this.userAuth.address()}`;
    const signature = await this.userAuth.signMessage(message);
    // derive encryption key from signature
    this.encryptionKey = await this.deriveKeyFromSignature(signature);
  };

  private deriveKeyFromSignature = async (signature: string) => {
    const enc = new TextEncoder();

    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(signature),
      'HKDF',
      false,
      ['deriveBits', 'deriveKey']
    );

    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'HKDF',
        hash: 'SHA-256',
        salt: enc.encode(signature),
        info: new Buffer(''),
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    return key;
  };

  public encrypt = async (data: Blob) => {
    // blob => jwe
    // get data blob as binary and structure as Uint8Array
    // TODO: update approach to encode entire blob (including type) as Uint8Array
    console.log(data)
    const binaryData = await data
      .arrayBuffer()
      .then(arraybuffer => new Uint8Array(arraybuffer));

    // fetch/generate encryption key
    await this.generateEncryptionKey();

    // encrypt data as JWE
    const encrypted = await new jose.FlattenedEncrypt(
      // new TextEncoder().encode(data),
      binaryData
    )
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .encrypt(this.encryptionKey);

    // return JWE
    return encrypted;
  };

  public decrypt = async (encrypted: any) => {
    // jwe => blob
    // fetch/generate encryption key
    await this.generateEncryptionKey();
    const { plaintext } = await jose.flattenedDecrypt(
      encrypted,
      this.encryptionKey
    );

    // convert Uint8Array to blob
    // TODO: update approach to encode entire blob (including type) as Uint8Array
    const blob = new Blob([plaintext], { type: 'text/plain' });

    return blob;
  };
}

export { IEncryption, LitEncryption, SignatureEncryption };

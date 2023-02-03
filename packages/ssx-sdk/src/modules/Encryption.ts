import * as jose from 'jose';
import { IUserAuthorization } from './UserAuthorization';

interface IEncryption {
  // encrypt
  // decrypt
}

class LitEncryption implements IEncryption {
  private userAuth: IUserAuthorization;

  constructor(config: any, userAuth: IUserAuthorization) {
    this.userAuth = userAuth;
  }
}
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
    // const message = `Sign this message to generate an encryption key for ${this.userAuth.address}`;
    // const signature = await this.userAuth.provider
    //   .getSigner()
    //   .signMessage(message);
    const signature = 'fake signature';
    console.log('signature', signature);
    // derive encryption key from signature
    this.encryptionKey = this.deriveKeyFromSignature(signature);
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

    const key = await crypto.subtle.deriveKey(
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

  public encrypt = async (data: any) => {
    // blob => jwe
    await this.generateEncryptionKey();

    const encrypted = await new jose.FlattenedEncrypt(
      // new TextEncoder().encode(data),
      data
    )
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .encrypt(this.encryptionKey);

    return encrypted;
  };

  public decrypt = async (data: any) => {
    // jwe => blob
    await this.generateEncryptionKey();
    const { plaintext } = await jose.flattenedDecrypt(data, this.encryptionKey);
    return plaintext;
  };
}

export { IEncryption, LitEncryption, SignatureEncryption };

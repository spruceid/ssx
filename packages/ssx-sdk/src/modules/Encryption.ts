import * as jose from 'jose';
import { IUserAuthorization, UserAuthorization } from './UserAuthorization';
import * as LitJsSdk from '@lit-protocol/lit-node-client';

function jsonToUint8Array(jsonObj) {
  // Stringify the JSON object
  const jsonString = JSON.stringify(jsonObj);

  // Create a TextEncoder instance
  const encoder = new TextEncoder();

  // Encode the JSON string as a Uint8Array
  const uint8Array = encoder.encode(jsonString);

  return uint8Array;
}

function uint8ArrayToJson(uint8Array) {
  // Create a TextDecoder instance
  const decoder = new TextDecoder();

  // Decode the Uint8Array into a JSON string
  const jsonString = decoder.decode(uint8Array);

  // Parse the JSON string into a JSON object
  const jsonObj = JSON.parse(jsonString);

  return jsonObj;
}

/**
 * The Encryption module handles the encryption and decryption of data.
 * It expects a Blob as input to be encrypted and returns a Blob as output when
 * decrypted.
 *
 * The format encrypted state depends on the implementation.
 */
interface IEncryption {
  /**
   * Encrypts the data. The data is expected to be a JSON datatype.
   * The output type depends on the implementation.
   * @param data - The data to encrypt.
   * @returns The encrypted data.
   */
  encrypt: (data: any) => Promise<any>;
  /**
   * Decrypts the data. The encrypted type depends on the implementation. The
   * output returned is a JSON datatype.
   * @param encrypted - The encrypted data to decrypt.
   * @returns - The decrypted data as a blob
   */
  decrypt: (encrypted: any) => Promise<any>;
}

/**
 * The LitEncryptData interface describes the parameters for the 
 * LitEncryption's encrypt method.
 */
interface LitEncryptData {
  /**
   * 
   */
  content: any;
  /** 
   * Lit's access control. Check out 
   * {@link https://developer.litprotocol.com/accessControl/intro Lit's docs} 
   * for more information. 
   */
  accessControlConditions: Array<any>;
  /** 
   * Supported Blockchains. Check out 
   * {@link https://developer.litprotocol.com/resources/supportedChains Lit's docs} 
   * for more information. 
   */
  // chain: string;
}

/**
 * The LitDencryptData interface describes the parameters for the 
 * LitEncryption's decrypt method.
 */
interface LitDecryptData {
  /** Blob content returned by the encrypt method. */
  encryptedString: Blob;
  /** encryptedSymmetricKey content returned by the encrypt method. */
  encryptedSymmetricKey: string;
  /**
   * Lit's access control. Check out 
   * {@link https://developer.litprotocol.com/accessControl/intro Lit's docs} 
   * for more information. 
   */
  accessControlConditions: Array<any>;
  /**
   * Supported Blockchains. Check out 
   * {@link https://developer.litprotocol.com/resources/supportedChains Lit's docs} 
   * for more information. 
   */
  // chain: string;
}

class LitEncryption implements IEncryption {
  private userAuth: IUserAuthorization;
  private client = new LitJsSdk.LitNodeClient({});
  private litNodeClient;

  constructor(config: any, userAuth: IUserAuthorization) {
    this.userAuth = userAuth;
  }

  public connect = async () => {
    await this.client.connect();
    this.litNodeClient = this.client;
  }

  public encrypt = async (data: LitEncryptData) => {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const { session } = this.userAuth as UserAuthorization;

    if (!session) {
      throw new Error("Sign in before trying to encrypt your data.")
    }

    const authSig = {
      address: session.address,
      derivedVia: "web3.eth.personal.sign",
      sig: session.signature,
      signedMessage: session.siwe,
    };

    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(data.content)

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions: data.accessControlConditions,
      symmetricKey,
      authSig,
      chain: "ethereum",
    });

    return {
      encryptedString,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
    }
  };

  public decrypt = async (encrypted: LitDecryptData) => {
    if (!this.litNodeClient) {
      await this.connect()
    }

    const { session } = this.userAuth as UserAuthorization;

    if (!session) {
      throw new Error("Sign in before trying to encrypt your data.")
    }

    const authSig = {
      address: session.address,
      derivedVia: "web3.eth.personal.sign",
      sig: session.signature,
      signedMessage: session.siwe,
    };

    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions: encrypted.accessControlConditions,
      toDecrypt: encrypted.encryptedSymmetricKey,
      chain: "ethereum",
      authSig
    })

    const decryptedString = await LitJsSdk.decryptString(
      encrypted.encryptedString,
      symmetricKey
    );

    return { decryptedString }
  }
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

  public encrypt = async (data: any) => {
    // json => jwe
    const binaryData = jsonToUint8Array(data);

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
    // jwe => json
    // fetch/generate encryption key
    await this.generateEncryptionKey();
    const { plaintext } = await jose.flattenedDecrypt(
      encrypted,
      this.encryptionKey
    );

    // convert Uint8Array to json
    const data = uint8ArrayToJson(plaintext);
    return data;
  };
}

export { IEncryption, LitEncryption, SignatureEncryption };

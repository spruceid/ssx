import * as jose from 'jose';
import { base58btc } from 'multiformats/bases/base58';
import { base64url } from 'multiformats/bases/base64';

interface ISessionKeyManager {
  getDID: () => string;
  getPublicKey: () => jose.JWK;
  getPrivateKey: () => jose.JWK;
}

class SessionKeyManager {
  private sessionKey: jose.JWK;
  private keyCreated: Promise<boolean>;

  constructor(sessionKey?: jose.JWK) {
    this.keyCreated = Promise.resolve(false);
    // needs to be sync
    if (sessionKey) {
      this.sessionKey = sessionKey;
      this.keyCreated = Promise.resolve(true);
    } else {
      this.keyCreated = this.createSessionKey();

      // harcode for now
      this.sessionKey = {
        crv: 'Ed25519',
        d: 'ktGkCIWIPomMelCAt3Gs556-LpVFDy5LU8zi1BsfZ34',
        x: 'oJKONy4BhgF77mB5P6o8gdMRtSDYFnbieVfnBQS_TUA',
        kty: 'OKP',
      };
    }
  }

  private createSessionKey = async () => {
    if (this.sessionKey) return;
    const keyPair = await jose.generateKeyPair('EdDSA', { crv: 'Ed25519' });
    this.sessionKey = await jose.exportJWK(keyPair.privateKey);
    return false;
  };

  public getDID = async () => {
    await this.keyCreated;
    // Key creation following https://w3c-ccg.github.io/did-method-key/#format
    const publicKeyBytes = base64url.baseDecode(this.sessionKey.x);
    const ed25519PublicKey = new Uint8Array(
      [0xed, 0x01].concat(Array.from(publicKeyBytes))
    );

    const publicKeyBase58 = base58btc.baseEncode(ed25519PublicKey);
    const prefixedKey = `z${publicKeyBase58}`;
    const sessionKeyDID = `did:key:${prefixedKey}#${prefixedKey}`;

    return sessionKeyDID;
  };

  public getPublicKey = async () => {
    await this.keyCreated;
    const { d: _, ...remaining } = this.sessionKey;
    return remaining;
  };

  public getPrivateKey = async () => {
    await this.keyCreated;
    return this.sessionKey;
  };
}

export default SessionKeyManager;

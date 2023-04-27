import * as jose from 'jose';
import { base58btc } from 'multiformats/bases/base58';
import { base64url } from 'multiformats/bases/base64';

class SessionKeyManager {
  private sessionKey: jose.JWK;

  constructor(sessionKey?: jose.JWK) {
    // needs to be sync
    if (sessionKey) {
      this.sessionKey = sessionKey;
    } else {
      //   // do this sync in constructor
      //   const keyPair = await jose.generateKeyPair('EdDSA', { crv: 'Ed25519' });
      //   this.sessionKey = await jose.exportJWK(keyPair.privateKey);

      // harcode for now
      this.sessionKey = {
        crv: 'Ed25519',
        d: 'ktGkCIWIPomMelCAt3Gs556-LpVFDy5LU8zi1BsfZ34',
        x: 'oJKONy4BhgF77mB5P6o8gdMRtSDYFnbieVfnBQS_TUA',
        kty: 'OKP',
      };
    }
  }

  public getDID = () => {
    // Key creation following https://w3c-ccg.github.io/did-method-key/#format
    const publicKeyBytes = base64url.decoder.baseDecode(this.sessionKey.x);
    const ed25519PublicKey = new Uint8Array(
      [0xed, 0x01].concat(Array.from(publicKeyBytes))
    );

    const publicKeyBase58 = base58btc.baseEncode(ed25519PublicKey);
    const prefixedKey = `z${publicKeyBase58}`;
    const sessionKeyDID = `did:key:${prefixedKey}#${prefixedKey}`;

    return sessionKeyDID;
  };

  public getPublicKey = () => {
    const { d: _, ...remaining } = this.sessionKey;
    return remaining;
  };

  public getPrivateKey = () => {
    return this.sessionKey;
  };
}

export default SessionKeyManager;

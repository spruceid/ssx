interface IEncryption {
  // encrypt
  // decrypt
}

class LitEncryption implements IEncryption {}
class SignatureEncryption implements IEncryption {}

export { IEncryption, LitEncryption, SignatureEncryption };

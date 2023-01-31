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

  constructor(config: any, userAuth: IUserAuthorization) {
    this.userAuth = userAuth;
  }
}

export { IEncryption, LitEncryption, SignatureEncryption };

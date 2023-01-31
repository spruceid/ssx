import { IEncryption } from './Encryption';
import { IUserAuthorization } from './UserAuthorization';

interface IStorage {
  // createStorage
  // getStorage
  // listStorage
  // deleteStorage
  // updateStorage
}

interface IDataVault extends IStorage {
  // unencrypted_createStorage
  // createStorage: encrypted_createStorage
  // unencrypted_getStorage
  // getStorage: encrypted_getStorage
}

class BrowserDataVault implements IDataVault {
  private encryption: IEncryption;

  constructor(config: any, encryption: IEncryption) {
    this.encryption = encryption;
  }
}
class KeplerDataVault implements IDataVault {
  private userAuth: IUserAuthorization;
  private encryption: IEncryption;

  constructor(
    config: any,
    userAuth: IUserAuthorization,
    encryption: IEncryption
  ) {
    this.userAuth = userAuth;
    this.encryption = encryption;
  }
}

export { IStorage, IDataVault, BrowserDataVault, KeplerDataVault };

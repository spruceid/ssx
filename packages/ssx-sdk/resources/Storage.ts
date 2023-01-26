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

class BrowserDataVault implements IDataVault {}
class KeplerDataVault implements IDataVault {}

export { IStorage, IDataVault, BrowserDataVault, KeplerDataVault };

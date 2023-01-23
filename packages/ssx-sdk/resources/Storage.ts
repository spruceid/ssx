interface IStorage {
  // createStorage
  // getStorage
  // listStorage
  // deleteStorage
  // updateStorage
}

class BrowserStorage implements IStorage {}
class DataVault implements IStorage {}

export { IStorage, BrowserStorage, DataVault };

interface IStorage {
  // createStorage
  // getStorage
  // listStorage
  // deleteStorage
  // updateStorage
}

interface IDataVault extends IStorage {}

class BrowserStorage implements IDataVault {}
class DataVault implements IDataVault {}

export { IStorage, BrowserStorage, DataVault };

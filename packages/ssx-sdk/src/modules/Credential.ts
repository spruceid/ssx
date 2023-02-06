import { IDataVault } from './Storage';

interface ICredential {
  // createCredential
  // getCredential
  // listCredential
  // deleteCredential
  // updateCredential
}

class Credential implements ICredential {
  private dataVault: IDataVault;

  constructor(config: any, dataVault: IDataVault) {
    this.dataVault = dataVault;
  }
}

export { ICredential, Credential };

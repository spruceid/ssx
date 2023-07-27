import { SSXExtension } from "@spruceid/ssx-core/client";
import { IStorage } from "./Storage";
import { Response, Request } from './Storage/kepler';


export interface ICredentialsList {
  credentialType?: string,
  request?: Request,
  removePrefix?: boolean
}

export interface ICredentials extends SSXExtension {
  /**
   * Retrieves the stored value associated with the specified credential key.
   * @param credential - The unique identifier for the stored value.
   * @returns A Promise that resolves to the value associated with the given credential key or undefined if the credential key does not exist.
   */
  get(credential: string): Promise<Response>;

  /**
   * Lists all credential keys available.
   * @param credentialType - The credential identifier for the stored value.
   * @returns A Promise that resolves to an array of strings representing the stored credentials keys.
   */
  list(options: ICredentialsList): Promise<Response>;

}
export class Credentials implements ICredentials {
  public namespace = 'credentials';
  private prefix: string = 'shared/credentials';
  private storage: IStorage;

  constructor(storage: IStorage) {
    this.storage = storage;
  }

  public async get(credential: string): Promise<Response> {
    return this.storage.get(credential, { prefix: this.prefix });
  }

  public async list(options: ICredentialsList): Promise<Response> {
    const defaultOptions = {
      prefix: this.prefix,
    };
    const { prefix, credentialType, request, removePrefix } = { ...defaultOptions, ...options };
    return this.storage.list({ prefix, path: credentialType, removePrefix, request });
  }

}
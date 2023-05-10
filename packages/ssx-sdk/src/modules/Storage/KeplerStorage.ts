import { initialized, kepler } from '@spruceid/ssx-sdk-wasm';
import { ConfigOverrides, SSXClientSession } from '@spruceid/ssx-core/client';
import { OrbitConnection, activateSession, hostOrbit, Request } from './kepler';
import { IStorage } from './interfaces';
import {
  IUserAuthorization,
  UserAuthorizationConnected,
  SiweMessage,
} from '../../';

export class KeplerStorage implements IStorage {
  public namespace = 'kepler';
  private prefix: string;
  private hosts: string[];
  private userAuth: IUserAuthorization;
  private keplerModule?: any;
  /** The users orbitId. */
  private orbitId?: string;

  /** The connection to the orbit. */
  private _orbit?: OrbitConnection;

  /** The domain to display in the SIWE message. */
  domain?: string;

  constructor(config: any, userAuth: IUserAuthorization) {
    this.userAuth = userAuth;
    this.hosts = ['https://kepler.spruceid.xyz']; // accept from config
    this.prefix = config?.prefix || '';
  }

  public async afterConnect(
    ssx: UserAuthorizationConnected
  ): Promise<ConfigOverrides> {
    await initialized;
    this.keplerModule = await kepler;
    (global as any).keplerModule = this.keplerModule;

    const address = await ssx.provider.getSigner().getAddress();
    const chain = await ssx.provider.getSigner().getChainId();

    this.orbitId = `kepler:pkh:eip155:${chain}:${address}://default`;

    this.domain = ssx.config.siweConfig?.domain;
    return {};
  }

  public async targetedActions(): Promise<{ [target: string]: string[] }> {
    const actions = {};
    actions[`${this.orbitId}/capabilities/`] = ['read'];
    actions[`${this.orbitId}/kv/${this.prefix}`] = [
      'put',
      'get',
      'list',
      'del',
      'metadata',
    ];
    return actions;
  }

  public async afterSignIn(ssxSession: SSXClientSession): Promise<void> {
    const keplerHost = this.hosts[0];
    const session = await Promise.resolve({
      jwk: JSON.parse(ssxSession.sessionKey),
      orbitId: this.orbitId,
      service: 'kv',
      siwe: ssxSession.siwe,
      signature: ssxSession.signature,
      verificationMethod: new SiweMessage(ssxSession.siwe).uri,
    })
      .then(JSON.stringify)
      .then(this.keplerModule.completeSessionSetup)
      .then(JSON.parse);

    return await activateSession(session, keplerHost)
      .catch(async ({ status, msg }) => {
        if (status !== 404) {
          throw new Error(
            `Failed to submit session key delegation to Kepler: ${msg}`
          );
        }
        const { status: hostStatus, statusText } = await hostOrbit(
          this.userAuth.getSigner(),
          keplerHost,
          this.orbitId,
          this.domain
        );
        if (hostStatus !== 200) {
          throw new Error(`Failed to open new Kepler Orbit: ${statusText}`);
        }
        return activateSession(session, keplerHost);
      })
      .then(authn => {
        this._orbit = new OrbitConnection(keplerHost, authn);
      });
  }

  get orbit(): OrbitConnection {
    if (!this._orbit) {
      throw new Error('KeplerStorage is not connected');
    }
    return this._orbit;
  }

  public async get(key: string, request?: Request): Promise<any> {
    return this.orbit.get(`${this.prefix}/${key}`, request);
  }

  public async put(key: string, value: any, request?: Request): Promise<any> {
    return this.orbit.put(`${this.prefix}/${key}`, value, request);
  }

  public async list(prefix?: string, request?: Request): Promise<any> {
    const p = prefix ? `${this.prefix}/${prefix}` : `${this.prefix}/`;
    const response = await this.orbit.list(p, request);
    // remove prefix from keys
    return { ...response, data: response.data.map(key => key.slice(p.length)) };
  }

  public async delete(key: string, request?: Request): Promise<any> {
    return this.orbit.delete(`${this.prefix}/${key}`, request);
  }

  public async deleteAll(): Promise<any> {
    return this.orbit.deleteAll(this.prefix);
  }
}

export default KeplerStorage;

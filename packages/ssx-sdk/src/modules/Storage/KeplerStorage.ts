import { initialized, kepler, ssxSession } from '@spruceid/ssx-sdk-wasm';
import { ConfigOverrides, SSXClientSession } from '@spruceid/ssx-core/client';
import { generateNonce } from 'siwe';
import {
  OrbitConnection,
  activateSession,
  hostOrbit,
  Response,
  Session,
} from './kepler';
import {
  IStorage,
  IKepler,
  IStorageListOptions,
  IStoragePutOptions,
  IStorageGetOptions,
  IStorageDeleteOptions,
} from './interfaces';
import {
  IUserAuthorization,
  UserAuthorizationConnected,
  SiweMessage,
} from '../../';

export type DelegateParams = {
  /** The target file or folder you are sharing */
  target: string;
  /** The DID of the key you are delegating to. */
  delegateDID: string;
  /** The actions you are authorizing the delegate to do. */
  actions: string[];
  /** The statement in the SIWE message */
  statement?: string;
};

export type DelegateResponse = {
  /** The contents of the SIWE message */
  siwe: string;
  /** The signature of the SIWE message */
  signature: string;
  /** The version of the delegation issued */
  version: number;
};

export class KeplerStorage implements IStorage, IKepler {
  public namespace = 'kepler';
  public prefix: string;
  private hosts: string[];
  private autoCreateNewOrbit: boolean;
  private userAuth: IUserAuthorization;
  private keplerModule?: any;
  private credentialsModule?: boolean;
  /** The users orbitId. */
  public orbitId?: string;

  /** The connection to the orbit. */
  private _orbit?: OrbitConnection;

  /** Session Manager. Holds session keys and session objects */
  private sessionManager?: any;

  /** The domain to display in the SIWE message. */
  domain?: string;

  constructor(config: any, userAuth: IUserAuthorization) {
    this.userAuth = userAuth;
    this.hosts = [...(config?.hosts || []), 'https://kepler.spruceid.xyz'];
    this.prefix = config?.prefix || '';
    this.credentialsModule = config?.credentialsModule;
    this.autoCreateNewOrbit =
      config?.autoCreateNewOrbit === undefined
        ? true
        : config?.autoCreateNewOrbit;
  }

  public async afterConnect(
    ssx: UserAuthorizationConnected
  ): Promise<ConfigOverrides> {
    await initialized;
    this.keplerModule = await kepler;
    this.sessionManager = new (await ssxSession).SSXSessionManager();
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
    if (this.credentialsModule) {
      actions[`${this.orbitId}/kv/shared/credentials`] = [
        'get',
        'list',
        'metadata',
      ];
    }
    return actions;
  }

  public async generateKeplerSession(
    ssxSession: SSXClientSession
  ): Promise<Session> {
    return await Promise.resolve({
      jwk: JSON.parse(ssxSession.sessionKey),
      orbitId: this.orbitId,
      service: 'kv',
      siwe: ssxSession.siwe,
      signature: ssxSession.signature,
      verificationMethod: new SiweMessage(ssxSession.siwe).uri,
    })
      .then(JSON.stringify)
      // @TODO: figure out unit test issue
      .then(this.keplerModule.completeSessionSetup)
      .then(JSON.parse);
  }

  public async afterSignIn(ssxSession: SSXClientSession): Promise<void> {
    const keplerHost = this.hosts[0];
    const session = await this.generateKeplerSession(ssxSession);

    let authn;
    try {
      authn = await activateSession(session, keplerHost);
    } catch ({ status, msg }) {
      if (status !== 404) {
        throw new Error(
          `Failed to submit session key delegation to Kepler: ${msg}`
        );
      }

      if (this.autoCreateNewOrbit === true) {
        await this.hostOrbit(ssxSession);
        return;
      }
    }

    if (authn) {
      this._orbit = new OrbitConnection(keplerHost, authn);
    }
  }

  get orbit(): OrbitConnection {
    if (!this._orbit) {
      throw new Error('KeplerStorage is not connected');
    }
    return this._orbit;
  }

  public async get(
    key: string,
    options: IStorageGetOptions = {}
  ): Promise<Response> {
    const defaultOptions = {
      prefix: this.prefix,
    };
    const { prefix, request } = { ...defaultOptions, ...options };
    return this.orbit.get(`${prefix}/${key}`, request);
  }

  public async put(
    key: string,
    value: any,
    options: IStoragePutOptions = {}
  ): Promise<Response> {
    const defaultOptions = {
      prefix: this.prefix,
    };
    const { prefix, request } = { ...defaultOptions, ...options };
    return this.orbit.put(`${prefix || this.prefix}/${key}`, value, request);
  }

  public async list(
    options: IStorageListOptions = {}
  ): Promise<Response> {
    const defaultOptions = {
      prefix: this.prefix,
      removePrefix: false,
    };
    const { prefix, path, request, removePrefix } = { ...defaultOptions, ...options };
    const p = path ? `${prefix}/${path}` : `${prefix}/`;
    const response = await this.orbit.list(prefix, request);
    // remove prefix from keys
    return removePrefix
      ? { ...response, data: response.data.map(key => key.slice(p.length)) }
      : response;
  }

  public async delete(
    key: string,
    options: IStorageDeleteOptions = {}
  ): Promise<Response> {
    const defaultOptions = {
      prefix: this.prefix,
    };
    const { prefix, request } = { ...defaultOptions, ...options };
    return this.orbit.delete(`${prefix}/${key}`, request);
  }

  public async deleteAll(prefix?: string): Promise<Response[]> {
    if (prefix) {
      return this.orbit.deleteAll(`${this.prefix}/${prefix}`);
    } else {
      return this.orbit.deleteAll(this.prefix);
    }
  }

  public async activateSession(
    ssxSession?: SSXClientSession,
    onError?: () => void
  ): Promise<boolean> {
    try {
      if (!ssxSession) {
        ({ session: ssxSession } = this.userAuth);
      }

      const session = await this.generateKeplerSession(ssxSession);

      const keplerHost = this.hosts[0];
      await activateSession(session, keplerHost).then(authn => {
        this._orbit = new OrbitConnection(keplerHost, authn);
      });
      return true;
    } catch (error) {
      onError?.();
      return false;
    }
  }

  public async hostOrbit(ssxSession?: SSXClientSession): Promise<void> {
    const keplerHost = this.hosts[0];
    const { status: hostStatus, statusText } = await hostOrbit(
      this.userAuth.getSigner(),
      keplerHost,
      this.orbitId,
      this.domain
    );

    if (hostStatus !== 200) {
      throw new Error(`Failed to open new Kepler Orbit: ${statusText}`);
    }

    await this.activateSession(ssxSession, () => {
      throw new Error(
        'Session not found. You must be signed in to host an orbit'
      );
    });
  }

  public async delegate({
    target,
    delegateDID,
    actions,
    statement,
  }: DelegateParams): Promise<DelegateResponse> {
    // add actions to session builder
    this.sessionManager.resetBuilder();
    this.sessionManager.addTargetedActions(this.namespace, target, actions);

    // create siwe message
    const address =
      this.userAuth?.address() ||
      (await this.userAuth.getSigner().getAddress());
    const chainId: number =
      this.userAuth?.chainId() ||
      (await this.userAuth.getSigner().getChainId());
    const siweConfig = {
      statement,
      address,
      walletAddress: address,
      chainId,
      domain: globalThis.location.hostname,
      issuedAt: new Date().toISOString(),
      nonce: generateNonce(),
    };

    // build and sign message
    const siwe = await this.sessionManager.build(siweConfig, null, delegateDID);
    const signature = await this.userAuth.signMessage(siwe);

    return {
      siwe,
      signature,
      version: 1,
    };
  }

  public async generateSharingLink(
    path: string,
    params?: any
  ): Promise<string> {
    // generate key
    const allKeys = await this.sessionManager.listSessionKeys();
    const keyId = await this.sessionManager.createSessionKey(
      `sharekey-${allKeys.length}`
    );
    const sessionKey = this.sessionManager.jwk(keyId);
    const delegateDID = await this.sessionManager.getDID(keyId);

    // get file target + permissions
    const target = `${this.orbitId}/kv/${path}`;
    const actions = ['get', 'metadata'];

    // delegate permission to target
    const { siwe, signature } = await this.delegate({
      target,
      delegateDID,
      actions,
      statement: 'I am giving permission to read this data.',
    });

    // create ssx + kepler session
    const sessionData: SSXClientSession = {
      address: this.userAuth.address(),
      walletAddress: this.userAuth.address(),
      chainId: this.userAuth.chainId(),
      sessionKey,
      siwe,
      signature,
    };

    const session = await this.generateKeplerSession(sessionData);
    /* activate session */
    // is this required? only for revocation? @chunningham
    const keplerHost = this.hosts[0];
    await activateSession(session, keplerHost).catch(({ status, msg }) => {
      if (status !== 404) {
        throw new Error(
          `Failed to submit session key delegation to Kepler: ${msg}`
        );
      }
    });
    /* end activate session */

    // store session with key
    // bundle delegation and encode
    const shareData = {
      path,
      keplerHost: this.hosts[0],
      session,
    };

    const shareJSON = JSON.stringify(shareData);
    const shareBase64 = btoa(shareJSON);
    return shareBase64;
  }

  public async retrieveSharingLink(encodedShare: string): Promise<Response> {
    (global as any).keplerModule = await kepler;

    // read key and delegation bundle
    const shareJSON = atob(encodedShare);
    const { path, keplerHost, session } = JSON.parse(shareJSON);

    // activate session and retrieve data
    try {
      const authn = await activateSession(session, keplerHost);
      const orbit = new OrbitConnection(keplerHost, authn);
      const response = await orbit.get(path);
      return response;
    } catch (error) {
      const { status, msg } = error;
      if (status !== 404) {
        throw new Error(
          `Failed to submit session key delegation to Kepler: ${msg}`
        );
      }
    }
  }
}

export default KeplerStorage;

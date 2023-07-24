import { initialized, kepler } from "@spruceid/ssx-sdk-wasm";
import {
  ConfigOverrides,
  SSXClientSession,
} from "@spruceid/ssx-core/client";
import {
  OrbitConnection,
  activateSession,
  hostOrbit,
  Response,
} from "./kepler";
import {
  IStorage,
  IKepler,
  IStorageListOptions,
  IStoragePutOptions,
  IStorageGetOptions,
  IStorageDeleteOptions,
} from "./interfaces";
import {
  IUserAuthorization,
  UserAuthorizationConnected,
  SiweMessage,
} from "../../";

export class KeplerStorage implements IStorage, IKepler {
  public namespace = "kepler";
  private prefix: string;
  private hosts: string[];
  private autoCreateNewOrbit: boolean;
  private userAuth: IUserAuthorization;
  private keplerModule?: any;
  /** The users orbitId. */
  public orbitId?: string;

  /** The connection to the orbit. */
  private _orbit?: OrbitConnection;

  /** The domain to display in the SIWE message. */
  domain?: string;

  constructor(config: any, userAuth: IUserAuthorization) {
    this.userAuth = userAuth;
    this.hosts = [...(config?.hosts || []), "https://kepler.spruceid.xyz"];
    this.prefix = config?.prefix || "";
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
    (global as any).keplerModule = this.keplerModule;

    const address = await ssx.provider.getSigner().getAddress();
    const chain = await ssx.provider.getSigner().getChainId();

    this.orbitId = `kepler:pkh:eip155:${chain}:${address}://default`;

    this.domain = ssx.config.siweConfig?.domain;
    return {};
  }

  public async targetedActions(): Promise<{ [target: string]: string[] }> {
    const actions = {};
    actions[`${this.orbitId}/capabilities/`] = ["read"];
    actions[`${this.orbitId}/kv/${this.prefix}`] = [
      "put",
      "get",
      "list",
      "del",
      "metadata",
    ];
    return actions;
  }

  public async generateKeplerSession(
    ssxSession: SSXClientSession
  ): Promise<SSXClientSession> {
    return await Promise.resolve({
      jwk: JSON.parse(ssxSession.sessionKey),
      orbitId: this.orbitId,
      service: "kv",
      siwe: ssxSession.siwe,
      signature: ssxSession.signature,
      verificationMethod: new SiweMessage(ssxSession.siwe).uri,
    })
      .then(JSON.stringify)
      // @TODO: figure out unit test issue
      .then(this.keplerModule.completeSessionSetup)
      .then(JSON.parse);
  }

  public async afterSignIn(
    ssxSession: SSXClientSession
  ): Promise<void> {
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
      throw new Error("KeplerStorage is not connected");
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
      ? { ...response, data: response.data.map((key) => key.slice(p.length)) }
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

  public async deleteAll(prefix: string = this.prefix): Promise<Response[]> {
    return this.orbit.deleteAll(prefix);
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
      await activateSession(session, keplerHost).then((authn) => {
        this._orbit = new OrbitConnection(keplerHost, authn);
      });
      return true;
    } catch (error) {
      onError?.();
      return false;
    }
  }

  public async hostOrbit(
    ssxSession?: SSXClientSession
  ): Promise<void> {
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
        "Session not found. You must be signed in to host an orbit"
      );
    });
  }

  public async generateSharingLink(key: string, params?: any): Promise<string> {
    // generate key // done
    // delegate to key
    // bundle key and delegation
    // generate sharing link
    return "";
  }

  public async retrieveSharingLink(link: string): Promise<Response> {
    // read key and delegation bundle
    // retrieve data with key
    return {
      ok: true,
      status: 200,
      statusText: "ok",
      headers: new Headers(),
      data: {},
    };
  }
}

export default KeplerStorage;

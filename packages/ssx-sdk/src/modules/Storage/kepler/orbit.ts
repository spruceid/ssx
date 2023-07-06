import { Authenticator } from './authenticator';
import { KV } from './kv';
import { generateHostSIWEMessage, siweToDelegationHeaders } from './module';
import { WalletProvider } from './walletProvider';
import { Capabilities, CapSummary } from './capabilities';

// @TODO: define HostConfig type
type HostConfig = any;

/**
 * a connection to an orbit in a Kepler instance.
 *
 * This class provides methods for interacting with an orbit. Construct an instance of this class using {@link Kepler.orbit}.
 */
export class OrbitConnection {
  private orbitId: string;
  private kv: KV;
  private caps: Capabilities;

  /** @ignore */
  constructor(keplerUrl: string, authn: Authenticator) {
    this.orbitId = authn.getOrbitId();
    this.kv = new KV(keplerUrl, authn);
    this.caps = new Capabilities(keplerUrl, authn);
  }

  /** Get the id of the connected orbit.
   *
   * @returns The id of the connected orbit.
   */
  id(): string {
    return this.orbitId;
  }

  /** Store an object in the connected orbit.
   *
   * Supports storing values that are of type string,
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object | Object},
   * and values that are a {@link https://developer.mozilla.org/en-US/docs/Web/API/Blob | Blob} or Blob-like
   * (e.g. {@link https://developer.mozilla.org/en-US/docs/Web/API/File | File}).
   * ```ts
   * await orbitConnection.put('a', 'value');
   * await orbitConnection.put('b', {x: 10});
   *
   * let blob: Blob = new Blob(['value'], {type: 'text/plain'});
   * await orbitConnection.put('c', blob);
   *
   * let file: File = fileList[0];
   * await orbitConnection.put('d', file);
   * ```
   *
   * @param key The key with which the object is indexed.
   * @param value The value to be stored.
   * @param req Optional request parameters. Request Headers can be passed via the `headers` property.
   * @returns A {@link Response} without the `data` property.
   */
  async put(key: string, value: any, req?: Request): Promise<Response> {
    if (value === null || value === undefined) {
      return Promise.reject(
        `TypeError: value of type ${typeof value} cannot be stored.`
      );
    }

    const transformResponse = (response: FetchResponse) => {
      const { ok, status, statusText, headers } = response;
      return { ok, status, statusText, headers };
    };

    let blob: Blob;
    if (value instanceof Blob) {
      blob = value;
    } else if (typeof value === 'string') {
      blob = new Blob([value], { type: 'text/plain' });
    } else if (value.constructor && value.constructor.name === 'Object') {
      blob = new Blob([JSON.stringify(value)], { type: 'application/json' });
    } else {
      return Promise.reject(
        `TypeError: value of type ${typeof value} cannot be stored.`
      );
    }

    return this.kv.put(key, blob, req?.headers || {}).then(transformResponse);
  }

  /** Retrieve an object from the connected orbit.
   *
   * String and Object values, along with
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Blob | Blobs}
   * of type `text/plain` or `application/json` are converted into their respective
   * types on retrieval:
   * ```ts
   * await orbitConnection.put('string', 'value');
   * await orbitConnection.put('json', {x: 10});
   *
   * let blob = new Blob(['value'], {type: 'text/plain'});
   * await orbitConnection.put('stringBlob', blob);
   *
   * let blob = new Blob([{x: 10}], {type: 'application/json'});
   * await orbitConnection.put('jsonBlob', blob);
   *
   * let stringData: string = await orbitConnection.get('string').then(({ data }) => data);
   * let jsonData: {x: number} = await orbitConnection.get('json').then(({ data }) => data);
   * let stringBlobData: string = await orbitConnection.get('stringBlob').then(({ data }) => data);
   * let jsonBlobData: {x: number} = await orbitConnection.get('jsonBlob').then(({ data }) => data);
   * ```
   *
   * If the object has any other MIME type then a Blob will be returned:
   * ```ts
   * let blob = new Blob([new ArrayBuffer(8)], {type: 'image/gif'});
   * await orbitConnection.put('gif', blob);
   * let gifData: Blob = await orbitConnection.get('gif').then(({ data }) => data);
   * ```
   *
   * Alternatively you can retrieve any object as a
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream | ReadableStream},
   * by supplying request parameters:
   * ```ts
   * let data = await orbitConnection.get('key', {streamBody: true}).then(
   *   ({ data }: { data?: ReadableStream }) => {
   *     // consume the stream
   *   }
   * );
   * ```
   *
   * @param key The key with which the object is indexed.
   * @param req Optional request parameters.
   * @returns A {@link Response} with the `data` property (see possible types in the documentation above).
   */
  async get(key: string, req?: Request): Promise<Response> {
    const request = req || {};
    const streamBody = request.streamBody || false;

    const transformResponse = async (response: FetchResponse) => {
      const { ok, status, statusText, headers } = response;
      const type: string | null = headers.get('content-type');
      const data = !ok
        ? undefined
        : streamBody
        ? response.body
        : await // content type was not stored, let the caller decide how to handle the blob
          (!type
            ? response.blob()
            : type.startsWith('text/')
            ? response.text()
            : type === 'application/json'
            ? response.json()
            : response.blob());
      return { ok, status, statusText, headers, data };
    };

    return this.kv.get(key).then(transformResponse);
  }

  /** Delete an object from the connected orbit.
   *
   * @param key The key with which the object is indexed.
   * @param req Optional request parameters (unused).
   * @returns A {@link Response} without the `data` property.
   */
  async delete(key: string, req?: Request): Promise<Response> {
    const transformResponse = (response: FetchResponse) => {
      const { ok, status, statusText, headers } = response;
      return { ok, status, statusText, headers };
    };

    return this.kv.del(key).then(transformResponse);
  }

  /**
   * Delete all objects with the specified key prefix from the connected orbit.
   *
   * @param prefix Optional key prefix for filtering the objects to remove. Removes all objects if not specified.
   * @returns A Promise of an array of {@link Response} objects for each delete operation performed.
   */
  async deleteAll(prefix = ''): Promise<Response[]> {
    const kr = await this.kv.list(prefix);
    if (!kr.ok) return [kr];
    const keys: string[] = await kr.json();
    return await Promise.all(keys.map(key => this.delete(key)));
  }

  /** List objects in the connected orbit.
   *
   * The list of keys is retrieved as a list of strings:
   * ```ts
   * let keys: string[] = await orbitConnection.list().then(({ data }) => data);
   * ```
   * Optionally, you can retrieve the list of objects as a
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream | ReadableStream},
   * by supplying request parameters:
   * ```ts
   * let data = await orbitConnection.list("", {streamBody: true}).then(
   *   ({ data }: { data?: ReadableStream }) => {
   *     // consume the stream
   *   }
   * );
   * ```
   *
   * @param prefix The prefix that the returned keys should have.
   * @param req Optional request parameters.
   * @returns A {@link Response} with the `data` property as a string[].
   */
  async list(prefix = '', req?: Request): Promise<Response> {
    const request = req || {};
    const streamBody = request.streamBody || false;

    const transformResponse = async (response: FetchResponse) => {
      const { ok, status, statusText, headers } = response;
      const data = !ok
        ? undefined
        : streamBody
        ? response.body
        : await response.json();

      return { ok, status, statusText, headers, data };
    };

    return this.kv.list(prefix).then(transformResponse);
  }

  /** Retrieve metadata about an object from the connected orbit.
   *
   * @param key The key with which the object is indexed.
   * @param req Optional request parameters (unused).
   * @returns A {@link Response} without the `data` property.
   */
  async head(key: string, req?: Request): Promise<Response> {
    const transformResponse = (response: FetchResponse) => {
      const { ok, status, statusText, headers } = response;
      return { ok, status, statusText, headers };
    };

    return this.kv.head(key).then(transformResponse);
  }

  async sessions(): Promise<{ [cid: string]: CapSummary }> {
    return await this.caps.get('all');
  }
}

/** Optional request parameters.
 *
 * Not all options are applicable on every {@link OrbitConnection} method. See the documentation
 * of each method to discover what options are supported.
 */
export type Request = {
  /** Request to receive the data as a {@link https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream | ReadableStream}. */
  streamBody?: boolean;
  /** Add additional entries to the request HTTP Headers. */
  headers?: { [key: string]: string };
};

/** Response from kepler requests.
 *
 * The methods on {@link OrbitConnection} return a Response that may have `data` property. See the
 * documentation of each method to discover whether a method will return data and what type you
 * can expect.
 */
export type Response = {
  /** Whether the request was successful or not. */
  ok: boolean;
  /** The HTTP status code of the response from Kepler. */
  status: number;
  /** The textual representation of the HTTP status of the response from Kepler. */
  statusText: string;
  /** Metadata about the object and the request. */
  headers: Headers;
  /** The body of the response from Kepler. */
  data?: any;
};

type FetchResponse = globalThis.Response;

export const hostOrbit = async (
  wallet: WalletProvider,
  keplerUrl: string,
  orbitId: string,
  domain: string = window.location.hostname
): Promise<Response> => {
  const address = await wallet.getAddress();
  const chainId = await wallet.getChainId();
  const issuedAt = new Date(Date.now()).toISOString();
  const peerId = await fetch(keplerUrl + '/peer/generate').then(
    (res: FetchResponse) => res.text()
  );
  const config: HostConfig = {
    address,
    chainId,
    domain,
    issuedAt,
    orbitId,
    peerId,
  };
  const siwe = generateHostSIWEMessage(JSON.stringify(config));
  const signature = await wallet.signMessage(siwe);
  const hostHeaders = siweToDelegationHeaders(
    JSON.stringify({ siwe, signature })
  );
  return fetch(keplerUrl + '/delegate', {
    method: 'POST',
    headers: JSON.parse(hostHeaders),
  }).then(({ ok, status, statusText, headers }: FetchResponse) => ({
    ok,
    status,
    statusText,
    headers,
  }));
};

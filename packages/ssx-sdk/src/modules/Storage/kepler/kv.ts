import { Authenticator } from './authenticator';
import { invoke } from './kepler';

export class KV {
  constructor(private url: string, private auth: Authenticator) {}

  public async get(key: string): Promise<Response> {
    return await this.invoke({
      headers: await this.auth.invocationHeaders('kv', 'get', key),
    });
  }

  public async head(key: string): Promise<Response> {
    return await this.invoke({
      headers: await this.auth.invocationHeaders('kv', 'metadata', key),
    });
  }

  public async put(
    key: string,
    value: Blob,
    metadata: { [key: string]: string }
  ): Promise<Response> {
    return await this.invoke({
      body: value,
      headers: {
        ...metadata,
        ...(await this.auth.invocationHeaders('kv', 'put', key)),
      },
    });
  }

  public async del(key: string): Promise<Response> {
    return await this.invoke({
      headers: await this.auth.invocationHeaders('kv', 'del', key),
    });
  }

  public async list(prefix: string): Promise<Response> {
    return await this.invoke({
      headers: await this.auth.invocationHeaders('kv', 'list', prefix),
    });
  }

  invoke = (params: { headers: HeadersInit; body?: Blob }): Promise<Response> =>
    invoke(this.url, params);
}

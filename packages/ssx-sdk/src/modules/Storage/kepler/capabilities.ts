import { Authenticator } from './authenticator';
import { invoke } from './kepler';

export class Capabilities {
  constructor(private url: string, private auth: Authenticator) {}

  async get(query: string): Promise<{ [cid: string]: CapSummary }> {
    const res = await this.invoke({
      headers: await this.auth.invocationHeaders('capabilities', 'read', query),
    });
    if (res.status == 200 && res.body !== null) {
      return await res.json();
    } else {
      throw new Error(await res.text());
    }
  }

  invoke = (params: { headers: HeadersInit; body?: Blob }): Promise<Response> =>
    invoke(this.url, params);
}

export type Capability = {
  action: string;
  resource: string;
};

export type CapSummary = {
  capabilities: Capability[];
  delegator: string;
  delegate: string;
  parents: string[];
  raw: string;
};

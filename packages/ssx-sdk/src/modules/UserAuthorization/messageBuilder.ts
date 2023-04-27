import { Recap } from 'siwe-recap';
import { SiweMessage } from 'siwe';
import { CID } from 'multiformats/cid';

class MessageBuilder {
  recap: Recap;

  constructor() {
    this.recap = new Recap();
  }

  addAttenuation(
    resource: string,
    namespace = '*',
    name = '*',
    restriction = {}
  ) {
    this.recap.addAttenuation(resource, namespace, name, restriction);
  }

  addProof(cid: string | CID) {
    this.recap.addProof(cid);
  }

  build(config: string | Partial<SiweMessage>) {
    const siwe_message = new SiweMessage(config);
    return this.recap.add_to_siwe_message(siwe_message);
  }
}

export default MessageBuilder;

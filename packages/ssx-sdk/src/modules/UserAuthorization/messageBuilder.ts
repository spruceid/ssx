import { Recap } from 'siwe-recap';
import { SiweMessage } from 'siwe';
import { CID } from 'multiformats/cid';

interface IMessageBuilder {
    addAttenuation(
        resource: string,
        namespace?: string,
        name?: string,
        restriction?: {}
    ): void;
    addProof(cid: string | CID): void;
    build(config: string | Partial<SiweMessage>): SiweMessage;
}

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
    const siwe_message: any = new SiweMessage(config);
    const siwe = this.recap.add_to_siwe_message(siwe_message);
    return siwe.toMessage();
  }
}

export default MessageBuilder;

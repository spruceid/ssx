import {
  completeSessionSetup,
  invoke,
  makeOrbitId,
  prepareSession,
} from './module';
import { WalletProvider } from './walletProvider';

type SessionConfig = any;
type Session = any;

export async function startSession(
  wallet: WalletProvider,
  config?: Partial<SessionConfig>
): Promise<Session> {
  const address = config?.address ?? (await wallet.getAddress());
  const chainId = config?.chainId ?? (await wallet.getChainId());
  const domain = config?.domain ?? window.location.hostname;

  return Promise.resolve({
    address,
    chainId,
    domain,
    issuedAt: config?.issuedAt ?? new Date(Date.now()).toISOString(),
    notBefore: config?.notBefore,
    expirationTime:
      config?.expirationTime ??
      new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    actions: config?.actions ?? {
      kv: { '': ['put', 'get', 'list', 'del', 'metadata'] },
      capabilities: { '': ['read'] },
    },
    orbitId: config?.orbitId ?? makeOrbitId(address, chainId),
    parents: config?.parents,
    jwk: config?.jwk,
  })
    .then(JSON.stringify)
    .then(prepareSession)
    .then(JSON.parse)
    .then(async preparedSession => ({
      ...preparedSession,
      signature: await wallet.signMessage(preparedSession.siwe),
    }))
    .then(JSON.stringify)
    .then(completeSessionSetup)
    .then(JSON.parse);
}

export async function activateSession(
  session: Session,
  url: string
): Promise<Authenticator> {
  const res = await fetch(url + '/delegate', {
    method: 'POST',
    headers: session.delegationHeader,
  });

  if (res.status === 200) {
    return new Authenticator(session);
  } else {
    throw {
      status: res.status,
      msg: 'Failed to delegate to session key',
    };
  }
}

export class Authenticator {
  private orbitId: string;
  private serializedSession: string;
  constructor(session: Session) {
    this.orbitId = session.orbitId;
    this.serializedSession = JSON.stringify(session);
  }

  invocationHeaders = async (
    service: string,
    action: string,
    path: string
  ): Promise<HeadersInit> =>
    invoke(this.serializedSession, service, path, action).then(JSON.parse);
  getOrbitId = (): string => this.orbitId;
}

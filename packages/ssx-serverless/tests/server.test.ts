import { SSXEventLogTypes, SSXServer } from '../src';

const _create = async <T>(): Promise<T> => {
  return '' as T;
};
const _retrieve = async <T>(): Promise<T> => {
  return '' as T;
};
const _update = async <T>(): Promise<T> => {
  return '' as T;
};
const _delete = async <T>(): Promise<T> => {
  return '' as T;
};

const SIWE_MESSAGE = {
  domain: 'login.xyz',
  address: '0x9D85ca56217D2bb651b00f15e694EB7E713637D4',
  statement: 'Sign-In With Ethereum Example Statement',
  uri: 'https://login.xyz',
  version: '1',
  nonce: 'bTyXgcQxn2htgkjJn',
  issuedAt: '2022-01-27T17:09:38.578Z',
  chainId: 1,
  expirationTime: '2100-01-07T14:31:43.952Z',
};

const SIGNATURE =
  '0xdc35c7f8ba2720df052e0092556456127f00f7707eaa8e3bbff7e56774e7f2e05a093cfc9e02964c33d86e8e066e221b7d153d27e5a2e97ccd5ca7d3f2ce06cb1b';

test('Instantiate ssx-serverless successfully with default values', () => {
  expect(() => {
    const server = new SSXServer(
      {},
      { create: _create, retrieve: _retrieve, update: _update, delete: _delete }
    );
  }).not.toThrowError();
});

test('Should call ssxLog successfuly', async () => {
  const server = new SSXServer(
    {
      providers: {
        metrics: {
          service: 'ssx',
          apiKey: '',
        },
      },
    },
    { create: _create, retrieve: _retrieve, update: _update, delete: _delete }
  );
  await expect(
    server.log({ content: '', type: SSXEventLogTypes.LOGIN, userId: '' })
  ).resolves.not.toThrow();
});

test('Should call resolveEns successfuly', async () => {
  const server = new SSXServer(
    {},
    { create: _create, retrieve: _retrieve, update: _update, delete: _delete }
  );
  await expect(
    server.resolveEns('0x96F7fB7ed32640d9D3a982f67CD6c09fc53EBEF1')
  ).resolves.not.toThrow();
}, 20000);

test('Should call getNonce without opts successfuly', async () => {
  const server = new SSXServer(
    {},
    { create: _create, retrieve: _retrieve, update: _update, delete: _delete }
  );
  await expect(server.getNonce()).resolves.not.toThrow();
});

test('Should call create getNonce successfuly', async () => {
  const server = new SSXServer(
    {},
    { create: _create, retrieve: _retrieve, update: _update, delete: _delete }
  );
  await expect(
    server.getNonce({
      sessionKey: '...',
    })
  ).resolves.not.toThrow();
});

test('Should call update getNonce successfuly', async () => {
  const server = new SSXServer(
    {},
    { create: _create, retrieve: _retrieve, update: _update, delete: _delete }
  );
  await expect(server.getNonce({})).resolves.not.toThrow();
});

test('Should call signIn successfuly', async () => {
  const server = new SSXServer(
    {},
    { create: _create, retrieve: _retrieve, update: _update, delete: _delete }
  );
  await expect(
    server.signIn(SIWE_MESSAGE, SIGNATURE, '...', {
      resolveEnsAvatar: true,
    })
  ).resolves.not.toThrow();
}, 20000);

test('Should call signOut successfuly', async () => {
  const server = new SSXServer(
    {},
    { create: _create, retrieve: _retrieve, update: _update, delete: _delete }
  );
  await expect(server.signOut('')).resolves.not.toThrow();
});

test('Should call me successfuly', async () => {
  const server = new SSXServer(
    {},
    {
      create: _create,
      retrieve: async <T>(): Promise<T> => {
        return {
          siweMessage: SIWE_MESSAGE,
          signature: SIGNATURE,
          daoLogin: false,
          ens: {},
        } as T;
      },
      update: _update,
      delete: _delete,
    }
  );
  await expect(server.me('...')).resolves.not.toThrow();
});

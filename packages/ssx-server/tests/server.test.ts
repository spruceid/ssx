import express, { Express } from 'express';
import { createClient } from 'redis';
import {
  SSXExpressMiddleware,
  SSXHttpMiddleware,
  SSXRPCProviders,
  SSXServer,
} from '../src';
import { SSXEventLogTypes } from '@spruceid/ssx-core/server';

jest.mock('@spruceid/ssx-core');

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

test('Instantiate ssx-server successfully with default values', () => {
  expect(() => {
    const server = new SSXServer();
  }).not.toThrowError();
});

test('Instantiate ssx-server successfully with SSX as metrics provider', () => {
  expect(() => {
    const server = new SSXServer({
      providers: {
        metrics: {
          service: 'ssx',
          apiKey: '',
        },
      },
    });
  }).not.toThrowError();
});

test('Instantiate ssx-server successfully with a RPC provider', () => {
  expect(() => {
    const server = new SSXServer({
      providers: {
        rpc: {
          service: SSXRPCProviders.SSXAlchemyProvider,
          apiKey: 'someApiKey',
        },
      },
    });
  }).not.toThrowError();
});

test('Instantiate ssx-server express middleware successfully with default config', () => {
  expect(() => {
    const app: Express = express();
    const server = new SSXServer();
    app.use(SSXExpressMiddleware(server));
  }).not.toThrowError();
});

test('Instantiate ssx-server express middleware successfully with store config', () => {
  // setup redis client
  const redisClient = createClient({
    legacyMode: true,
    url: process.env.REDIS_URL,
  });
  const app: Express = express();
  expect(() => {
    const server = new SSXServer({
      providers: {
        sessionConfig: {
          store: (session) => {
            const redisStore = require('connect-redis')(session);
            return new redisStore({
              client: redisClient,
            });
          },
        },
      },
    });
    app.use(SSXExpressMiddleware(server));
  }).not.toThrowError();
});

test('Instantiate ssx-server http middleware successfully', () => {
  expect(() => {
    const server = new SSXServer();
    const ssxMiddleware = SSXHttpMiddleware(server);
  }).not.toThrowError();
});

test('Should call ssxLog successfuly', async () => {
  const server = new SSXServer({
    providers: {
      metrics: {
        service: 'ssx',
        apiKey: '',
      },
    },
  });
  await expect(
    server.log({ content: '', type: SSXEventLogTypes.LOGIN, userId: '' }),
  ).resolves.not.toThrow();
});

test('Should call ssxResolveEns successfuly', async () => {
  const server = new SSXServer();
  await expect(server.resolveEns('')).resolves.not.toThrow();
});

test('Should call destroy session stub successfuly', async () => {
  const server = new SSXServer();
  await expect(server.logout(async () => false)).resolves.toBeFalsy();
});

test('Should successfuly verify the message', async () => {
  const server = new SSXServer();
  await expect(
    server
      .login(
        SIWE_MESSAGE,
        SIGNATURE,
        true,
        { avatar: true },
        SIWE_MESSAGE.nonce,
      )
      .then(({ success }) => success),
  ).resolves.toBeTruthy();
});

test('Should fail to verify the message', async () => {
  const server = new SSXServer();
  await expect(
    server.login(SIWE_MESSAGE, '', false, false, SIWE_MESSAGE.nonce),
  ).rejects.toMatchObject({
    error: { type: 'Signature does not match address of the message.' },
  });
});

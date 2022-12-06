import express, { Express } from 'express';
import session from 'express-session';
import {
  SSXExpressMiddleware,
  SSXServer,
} from '../src';
import request from 'supertest';


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


let app: Express;

beforeAll(() => {
  app = express();
  const server = new SSXServer();
  app.use(session({ secret: 'FAKESECRET' }))
  app.use(SSXExpressMiddleware(server));
});

test('Should get nonce successfully', async () => {
  const res = await request(app)
    .get('/ssx-nonce');

  expect(res.statusCode).toEqual(200);
});

test('Should log in successfully', async () => {
  const res = await request(app)
    .post('/ssx-login')
    .send({
      siwe: SIWE_MESSAGE,
      signature: SIGNATURE,
      daoLogin: false,
      resolveEns: false
    });

  expect(res.statusCode).toEqual(200);
});

test('Should log in fail expecting field signature', async () => {
  const res = await request(app)
    .post('/ssx-login')
    .send({
      siwe: SIWE_MESSAGE,
      daoLogin: false,
      resolveEns: false
    });

  expect(res.statusCode).toEqual(422);
  expect(res.body.message).toEqual('Expected the field `signature` in body.');
});

test('Should log in fail expecting field siwe', async () => {
  const res = await request(app)
    .post('/ssx-login')
    .send({
      signature: SIGNATURE,
      daoLogin: false,
      resolveEns: false
    });

  expect(res.statusCode).toEqual(422);
  expect(res.body.message).toEqual('Expected the field `siwe` in the body.');
});

test('Should log in fail', async () => {
  const res = await request(app)
    .post('/ssx-login')
    .send({
      siwe: { ...SIWE_MESSAGE, nonce: 'nonce' },
      signature: SIGNATURE,
      daoLogin: false,
      resolveEns: false
    });

  expect(res.statusCode).toEqual(500);
});

test('Should log out successfully', async () => {
  const res = await request(app)
    .post('/ssx-logout');

  expect(res.statusCode).toEqual(204);
});

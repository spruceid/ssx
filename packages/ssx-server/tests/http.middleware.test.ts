import http from "http";
import {
  SSXHttpMiddleware,
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

let app;

beforeAll(() => {
  const ssx = new SSXServer({
    signingKey: 'FAKESIGNINKEY',
  });
  const ssxMiddleware = SSXHttpMiddleware(ssx);
  app = http.createServer(ssxMiddleware());
});

test('Should get nonce successfully', async () => {
  const res = await request(app)
    .get('/ssx-nonce');

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
});

test('Should log in fail expecting field nonce in session', async () => {
  const res = await request(app)
    .post('/ssx-login')
    .send({
      siwe: SIWE_MESSAGE,
      signature: SIGNATURE,
      daoLogin: false,
      resolveEns: false
    });

  expect(res.statusCode).toEqual(422);
});


test('Should log out successfully', async () => {
  const res = await request(app)
    .post('/ssx-logout');

  expect(res.statusCode).toEqual(200);
});

describe('Should override all paths successfully', () => {
  const ssx = new SSXServer({
    signingKey: 'FAKESIGNINKEY',
  });

  const ssxMiddleware = SSXHttpMiddleware(ssx, {
    nonce: '/ssx-custom-nonce',
    login: '/ssx-custom-login',
    logout: '/ssx-custom-logout',
  });

  const customApp = http.createServer(ssxMiddleware());
  
  test('Should get /ssx-custom-nonce successfully', async () => {
    const res = await request(customApp)
      .get('/ssx-custom-nonce');

    expect(res.statusCode).toEqual(200);
  });

  test('Should post /ssx-custom-login fail expecting field signature', async () => {
    const res = await request(customApp)
      .post('/ssx-custom-login')
      .send({
        siwe: SIWE_MESSAGE,
        daoLogin: false,
        resolveEns: false
      });

    expect(res.statusCode).toEqual(422);
  });

  test('Should post /ssx-custom-logout successfully', async () => {
    const res = await request(customApp)
      .post('/ssx-custom-logout');

    expect(res.statusCode).toEqual(200);
  });
});
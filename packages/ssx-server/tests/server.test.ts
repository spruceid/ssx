import express, { Express } from 'express';
import { SSXExpressMiddleware, SSXHttpMiddleware, SSXServer } from '../src';

test('Instantiate ssx-server successfully', () => {
  expect(() => {
    const server = new SSXServer();
  }).not.toThrowError();
});

test('Instantiate ssx-server express middleware successfully', () => {
  expect(() => {
    const app: Express = express();
    const server = new SSXServer();
    app.use(SSXExpressMiddleware(server));
  }).not.toThrowError();
});

test('Instantiate ssx-server http middleware successfully', () => {
  expect(() => {
    const server = new SSXServer();
    const ssxMiddleware = SSXHttpMiddleware(server);
  }).not.toThrowError();
});

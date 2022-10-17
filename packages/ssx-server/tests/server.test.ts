import { SSXServer } from '../src';

test('Instantiate ssx-server successfully', () => {
  expect(() => {
    const server = new SSXServer();
  }).not.toThrowError();
});
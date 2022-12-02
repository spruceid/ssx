import { SSXServer } from '../src';

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

test('Instantiate ssx-server successfully', () => {
  expect(() => {
    const server = new SSXServer(
      {},
      { create: _create, retrieve: _retrieve, update: _update, delete: _delete }
    );
  }).not.toThrowError();
});

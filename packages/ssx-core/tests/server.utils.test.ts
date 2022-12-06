import {
  SSXEventLogTypes,
  ssxLog,
} from '../src';

const mockAxios: any = jest.genMockFromModule('axios');
mockAxios.create = jest.fn(() => mockAxios);

test('Should call ssxLog successfully', async () => {
  const api = mockAxios.create({
    baseURL: 'https://api.ssx.id',
    headers: {
      Authorization: `Bearer `,
      'Content-Type': 'application/json',
    },
  });

  await expect(
    ssxLog(
      api,
      '',
      {
        content: '',
        type: SSXEventLogTypes.LOGIN,
        userId: ''
      }),
  ).resolves.not.toThrow();
});

test('Should fail calling ssxLog', async () => {
  const api = mockAxios.create({
    baseURL: 'https://api.ssx.id',
    headers: {
      Authorization: `Bearer `,
      'Content-Type': 'application/json',
    },
  });

  await expect(
    ssxLog(
      api,
      '...',
      {
        content: '',
        type: SSXEventLogTypes.LOGIN,
        userId: ''
      }),
  ).resolves.toBeFalsy();
});
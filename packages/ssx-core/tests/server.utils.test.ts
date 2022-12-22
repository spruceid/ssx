import { SSXEventLogTypes, ssxLog } from '../src/server';

const axios: any = jest.genMockFromModule('axios');

axios.create.mockReturnThis();

test('Should call ssxLog successfully', async () => {
  const api = axios.create({
    baseURL: 'https://api.ssx.id',
    headers: {
      Authorization: `Bearer `,
      'Content-Type': 'application/json',
    },
  });

  await expect(
    ssxLog(api, '', {
      content: '',
      type: SSXEventLogTypes.LOGIN,
      userId: '',
    })
  ).resolves.not.toThrow();
});

test('Should fail calling ssxLog', async () => {
  const api = axios.create({
    baseURL: 'https://api.ssx.id',
    headers: {
      Authorization: `Bearer `,
      'Content-Type': 'application/json',
    },
  });

  await expect(
    ssxLog(api, '...', {
      content: '',
      type: SSXEventLogTypes.LOGIN,
      userId: '',
    })
  ).rejects.toThrow();
});

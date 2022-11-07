import { getNonceSchema } from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'ssx-nonce',
        request: {
          schemas: {
            'application/json': getNonceSchema,
          },
        },
      },
    },
  ],
};
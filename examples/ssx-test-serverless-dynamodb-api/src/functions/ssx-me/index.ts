import { handlerPath } from '@libs/handler-resolver';
import { requireAddressSchema } from '@libs/schemas';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'ssx-me',
        request: {
          schemas: {
            'application/json': requireAddressSchema,
          },
        },
      },
    },
  ],
};
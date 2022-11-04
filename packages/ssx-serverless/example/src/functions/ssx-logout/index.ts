import { signOutSchema } from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'ssx-logout',
        request: {
          schemas: {
            'application/json': signOutSchema,
          },
        },
      },
    },
  ],
};
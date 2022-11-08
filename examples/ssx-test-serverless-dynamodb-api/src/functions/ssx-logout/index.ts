import { handlerPath } from '@libs/handler-resolver';
import { signOutSchema } from '@libs/schemas';

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
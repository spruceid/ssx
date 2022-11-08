import { handlerPath } from '@libs/handler-resolver';
import { signInSchema } from '@libs/schemas';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  timeout: 10,
  events: [
    {
      http: {
        method: 'post',
        path: 'ssx-login',
        request: {
          schemas: {
            'application/json': signInSchema,
          },
        },
      },
    },
  ],
};
import { signInSchema } from './schema';
import { handlerPath } from '@libs/handler-resolver';

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
import { getMeSchema } from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'ssx-me',
        request: {
          schemas: {
            'application/json': getMeSchema,
          },
        },
      },
    },
  ],
};
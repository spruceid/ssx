import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

type ResponseHandler<T> = (
  ...args: Parameters<APIGatewayProxyHandlerV2>
) => Promise<T>;

export const handleResponse =
  <T>(handler: ResponseHandler<T>): APIGatewayProxyHandlerV2 =>
    async (...args) => {
      try {
        const response = await handler(...args);
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(response),
        };
      } catch (error) {
        console.error(error);
        return {
          statusCode: error?.statusCode,
          body: error?.message,
        };
      }
    };
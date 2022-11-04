import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

type ResponseHandler<T> = (...args: Parameters<APIGatewayProxyHandlerV2>) => Promise<T>;

/**
 * HTTP harness that will return a JSON serialized response
 */
export const handleResponse = <T>(handler: ResponseHandler<T>): APIGatewayProxyHandlerV2 => async (...args) => {
  try {
    const resp = await handler(...args);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resp),
    };
  } catch (err) {
    console.error(err);
    if (typeof err?.statusCode === 'number') {
      return {
        statusCode: err.statusCode,
        body: err?.message ?? 'Unknown error',
      };
    }
    throw err;
  }
};
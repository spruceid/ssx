import { AxiosInstance } from 'axios';
import { SSXLogFields } from './types';

/**
 * Abstracts the fetch API to append correct headers, host and parse
 * responses to JSON for POST requests.
 * @param api - Axios Instance.
 * @param route -  Request route.
 * @param body - Request body.
 * @returns True (success) or false (error).
 */
export const ssxPost = (
  api: AxiosInstance,
  route: string,
  body: any
): Promise<boolean> => {
  return api
    .post(route, typeof body === 'string' ? body : JSON.stringify(body))
    .then((res: any) => res.status === 204)
    .catch((e: any) => {
      console.error(e);
      return false;
    });
};

/**
 * Registers a new event to the API.
 * @param api - Axios Instance.
 * @param apiKey - SSX Platform API Key.
 * @param data - SSXLogFields to log.
 * @returns True (success) or false (error).
 */
export const ssxLog = async (
  api: AxiosInstance,
  apiKey: string,
  data: SSXLogFields
): Promise<boolean> => {
  if (!data.timestamp) data.timestamp = new Date().toISOString();
  return Boolean(apiKey) && ssxPost(api, '/events', data);
};

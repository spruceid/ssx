import { AxiosInstance } from "axios";
import { SSXLogFields } from "./types";

/**
 * Abstracts the fetch API to append correct headers, host and parse
 * responses to JSON for POST requests.
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
            return false;
        });
};

/** Registers a new event to the API */
export const ssxLog = async (
    api: AxiosInstance,
    apiKey: string,
    data: SSXLogFields
): Promise<boolean> => {
    if (!data.timestamp) data.timestamp = new Date().toISOString();
    return (
        Boolean(apiKey) && ssxPost(api,'/events', data)
    );
};
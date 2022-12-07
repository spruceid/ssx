import bodyParser from 'body-parser';
import ssxEndpoints from './endpoints';
import { ssxMiddleware, SSXAuthenticated } from './middleware';
import { SSXServer } from '../../server';
import { SSXServerRoutes } from '@spruceid/ssx-core';

/**
 * This middleware function has two key functions:
 * 1. It provides 3 endpoints for the client to hit: /ssx-nonce, /ssx-login, and /ssx-logout. These endpoints are used to authenticate the SIWE message and issue sessions.
 * 2. It provides a middleware function that can be used to authenticate session. The middleware then exposes the authenticated session's data via the `req.ssx` property.
 *
 * @param ssx - The SSX server instance.
 */
const SSXExpressMiddleware = (ssx: SSXServer, routes?: SSXServerRoutes) => {
  return [
    ssx.session,
    bodyParser.json(),
    ssxMiddleware(ssx),
    ssxEndpoints(ssx, routes),
  ];
};
export { SSXExpressMiddleware, SSXAuthenticated };

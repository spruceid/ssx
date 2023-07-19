import { SiweMessage } from 'siwe';
import { Session, SessionData } from 'express-session';
import { IncomingMessage, ServerResponse } from 'http';
import { SSXRequestObject } from '../express/middleware';
import {
  isSSXServerMiddlewareConfig,
  SSXServerRoutes,
  SiweGnosisVerify,
} from '@spruceid/ssx-core';
import { SSXServerBaseClass } from '@spruceid/ssx-core/server';
import { getRoutePath } from '../utils';
import url from 'url';

declare module 'http' {
  interface IncomingMessage {
    sessionID: string;
    ssx: SSXRequestObject & Omit<Partial<SSXServerBaseClass>, 'log'>;
    session: Session & Partial<SessionData>;
  }
}

function getBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(JSON.parse(body));
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * This middleware function does the following:
 * 1. Checks for a ssx-session cookie and if it exists, it will manage and set the session on the request object.
 * 2. Adds a ssx field to the request object with SSX authentication information in the object.
 * 3. It adds a nonce, login, and logout route to the server
 *
 * This function returns another function that can take an event listen as a parameter
 * and calls it with the updated request object if none of the ssx routes are hit.
 *
 * @param ssx - The SSX server instance.
 * @returns requestListener: function (req: Request, res: Response) =\> (req: IncomingMessage, res: ServerResponse)
 */
export const SSXHttpMiddleware = (
  ssx: SSXServerBaseClass,
  routes?: SSXServerRoutes,
) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return (requestListener = (req, res) => {}) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (req: IncomingMessage, res: ServerResponse) => {
      // session middleware
      await new Promise((resolve) => {
        ssx.session(req as any, res as any, resolve);
      });

      // ssx middleware
      req.ssx = {
        ...ssx,
        verified: false,
      };

      if (req.session?.siwe) {
        const { signature, siwe, daoLogin, nonce } = req.session;
        let siweMessageVerification;
        try {
          siweMessageVerification = await new SiweMessage(siwe).verify(
            { signature, nonce },
            {
              verificationFallback: daoLogin ? SiweGnosisVerify : null,
              provider: ssx.provider,
            },
          );
        } catch (error) {}
        const { success: verified, data } = siweMessageVerification;
        if (verified) {
          req.ssx = {
            ...req.ssx,
            siwe: data,
            verified,
            userId: `did:pkh:eip155:${siwe.chainId}:${siwe.address}`,
          };
        } else {
          req.session.destroy(() => {});
        }
      }
      const { pathname } = url.parse(req.url);
      // ssx endpoints
      if (pathname === getRoutePath(routes?.nonce, '/ssx-nonce')) {
        req.session.nonce = ssx.generateNonce();
        res.statusCode = 200;
        res.end(req.session.nonce);
        isSSXServerMiddlewareConfig(routes?.nonce)
          ? routes?.nonce?.callback(req)
          : null;
        return;
      } else if (pathname === getRoutePath(routes?.login, '/ssx-login')) {
        // get body data
        const body = await getBody(req);
        if (!body) {
          res.statusCode = 422;
          res.end('Expected body.');
          return;
        }
        if (!body.signature) {
          res.statusCode = 422;
          res.end('Expected the field `signature` in body.');
          return;
        }
        if (!body.siwe) {
          res.statusCode = 422;
          res.end('Expected the field `siwe` in body.');
          return;
        }
        if (!req.session.nonce) {
          res.statusCode = 422;
          res.end('Expected the field `nonce` to be set on this session.');
          return;
        }

        const { success, error, session } = await ssx.login(
          body.siwe,
          body.signature,
          body.daoLogin,
          body.resolveEns,
          req.session.nonce,
          body.resolveLens,
        );

        if (!success) {
          let message: string = error.type;
          if (error.expected && error.received) {
            message += ` Expected: ${error.expected}. Received: ${error.received}`;
          }
          res.statusCode = 400;
          return res.end(JSON.stringify({ message }));
        }

        req.session.siwe = session.siwe;
        req.session.signature = session.signature;
        req.session.daoLogin = session.daoLogin;
        req.session.ens = session.ens;
        req.session.lens = session.lens;

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ...req.session }));
        isSSXServerMiddlewareConfig(routes?.login)
          ? routes?.login?.callback(req, body)
          : null;
      } else if (pathname === getRoutePath(routes?.logout, '/ssx-logout')) {
        req.session.destroy(null);
        req.session = null;
        await req.ssx.logout();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true }));
        isSSXServerMiddlewareConfig(routes?.logout)
          ? routes?.logout?.callback(req)
          : null;
      }

      // run user defined requestListener
      if (!res.headersSent) {
        requestListener && requestListener(req, res);
      }
    };
  };
};

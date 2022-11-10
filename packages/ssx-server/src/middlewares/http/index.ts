import { SiweMessage } from 'siwe';
import { SiweGnosisVerify } from '@spruceid/ssx-gnosis-extension';
import { Session, SessionData } from 'express-session';
import { IncomingMessage, ServerResponse } from 'http';
import { SSXServer } from '../../server';
import { SSXRequestObject } from '../express/middleware';

declare module 'http' {
  interface IncomingMessage {
    sessionID: string;
    ssx: SSXRequestObject & Omit<Partial<SSXServer>, 'log'>;
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
export const SSXHttpMiddleware = (ssx: SSXServer) => {
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
        try {
          const { signature, siwe, daoLogin, nonce } = req.session;
          const { success: verified, data } = await new SiweMessage(
            siwe,
          ).verify(
            { signature, nonce },
            {
              verificationFallback: daoLogin ? SiweGnosisVerify : null,
              provider: ssx.provider,
            },
          );

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
        } catch (error) {
          // ignore errors? Log them?
        }
      }

      // ssx endpoints
      if (req.url === '/ssx-nonce') {
        req.session.nonce = ssx.generateNonce();
        res.statusCode = 200;
        res.end(req.session.nonce);
      } else if (req.url === '/ssx-login') {
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
          req.session.nonce,
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

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ session: req.session }));
      } else if (req.url === '/ssx-logout') {
        req.session.destroy(null);
        req.session = null;
        await req.ssx.logout();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true }));
      }

      // run user defined requestListener
      if (!res.headersSent) {
        requestListener && requestListener(req, res);
      }
    };
  };
};

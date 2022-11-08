import { SSXServer } from '../../server';
import { SiweMessage } from 'siwe';
import { NextFunction, Request, Response } from 'express';
import { SSXLogFields } from '../../types';
import { SiweGnosisVerify } from '@spruceid/ssx-gnosis-extension';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      ssx: SSXRequestObject & Omit<Partial<SSXServer>, 'log'>;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    /** The SIWE request embedded in ssx-session */
    siwe: SiweMessage;
    /** Unique value */
    nonce: string;
    /** The signature for the SIWE request embedded in ssx-session */
    signature?: string;
    /** If it's a DAO session */
    daoLogin: boolean;
  }
}

/** Interface for the ssx fields on a request object. */
export interface SSXRequestObject {
  /** The signature for the SIWE request embedded in ssx-session */
  signature?: string;
  /** The SIWE request embedded in ssx-session */
  siwe?: SiweMessage;
  /** A flag to have the server lookup and verifiy that the signer is a delegee of the contract in the SIWE request */
  daoLogin?: boolean;
  /** The address of the user who signed in */
  userId?: string;
  /** A boolean indicating if the client's session has been verified/authenticated */
  verified: boolean;
  /** A function that logs the event to the SSX platform */
  log: (data: SSXLogFields) => Promise<boolean>;
}

/**
 * This middleware function can be used to protect an Express route with SSX authentication.
 * It will check for ssx.verified and if it is set, the route will be allowed to proceed.
 * If it is not set, the route will redirect or return a 401 Unauthorized response, based on the
 * value of the redirect property.
 * @param redirectURL - The URL to redirect to if the user is not authenticated.
 **/
export const SSXAuthenticated = (redirectURL?: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.ssx.verified) {
      next();
    } else {
      if (redirectURL) {
        res.redirect(redirectURL);
      } else {
        res.status(401).json({ success: false, message: 'Unauthorized' });
      }
    }
  };
};

/**
 * This middleware function intercepts and validates cookies with the ssx-prefix
 * and adds their properties to the `ssx` property to the Express Request object.
 * This property is set by this middleware and contains the following properties:
 * - cookies: an object containing the cookies sent by the client
 * - verified: a boolean indicating if the client is authenticated
 * - userId: the user id of the client
 * - log: a function that logs the event to the SSX platform
 * - signature: the signature of the client
 * - siwe: the siwe message of the client
 *
 * @param {SSXServer} ssx
 * @returns {(req: Request, res: Response, next: NextFunction) => void}
 */
export const ssxMiddleware = (ssx: SSXServer) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    req.ssx = {
      ...ssx,
      verified: false,
    };

    if (req.session?.siwe) {
      try {
        const { signature, siwe, daoLogin, nonce } = req.session;
        const { success: verified, data } = await new SiweMessage(siwe).verify(
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
          req.session.destroy(() => next());
        }
      } catch (error) {
        // ignore errors? Log them?
      }
    }
    next();
  };
};

export default { ssxMiddleware, SSXAuthenticated };

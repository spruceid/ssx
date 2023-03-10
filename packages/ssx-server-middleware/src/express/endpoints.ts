import express from 'express';
import { Request, Response } from 'express';
import { SSXServerRouteNames, SSXAuthenticationMethod } from '@spruceid/ssx-core';
import { SSXServerBaseClass, SSXLoginPayload } from '@spruceid/ssx-core/server';
import { SessionData } from 'express-session';

const ssxEndpoints = (
  ssx: SSXServerBaseClass,
  routes?: SSXServerRouteNames
) => {
  const router = express.Router();

  /**
   * This endpoint provides a randomly generated nonce for the client to use in
   * a Sign-in with Ethereum signature. This is used to prevent replay attacks.
   * It issues a session token `ssx-nonce` that is used to sign the next request.
   *
   * @name /ssx-nonce
   * @param {Request} req
   * @param {Response} res
   */
  router.get(
    routes?.nonce ?? '/ssx-nonce',
    function (req: Request, res: Response): void {
      req.session.siwe = undefined;
      req.session.nonce = ssx.generateNonce();
      req.session.save(() => res.status(200).send(req.session.nonce));
    }
  );

  /**
   * This endpoint verifies the signature of the client and the nonce. If the signature is valid,
   * the server issues a session token `ssx-session` that is used by the middleware to authenticate requests.
   * If logging is enabled, the server will also log the sign-in to SSX platform.
   *
   * @async
   * @name /ssx-login
   * @param {Request} req
   * @param {Response} res
   */
  router.post(
    routes?.login ?? '/ssx-login',
    async function (req: Request, res: Response) {
      if (!req.body) {
        res.status(422).json({ message: 'Expected body.' });
        return;
      }
      if (!req.body.signature) {
        res
          .status(422)
          .json({ message: 'Expected the field `signature` in body.' });
        return;
      }
      if (!req.body.siwe) {
        res
          .status(422)
          .json({ message: 'Expected the field `siwe` in the body.' });
        return;
      }

      let ssxLoginResponse;

      try {
        ssxLoginResponse = await ssx.login(
          req.body.siwe,
          req.body.signature,
          req.body.daoLogin,
          req.body.resolveEns,
          req.session.nonce,
          req.body.resolveLens
        );
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }

      const { success, error, session } = ssxLoginResponse;

      if (!success) {
        let message: string = error.type;
        if (error.expected && error.received) {
          message += ` Expected: ${error.expected}. Received: ${error.received}`;
        }
        return res.status(400).json({ message });
      }

      const payload: SSXLoginPayload = {
        siwe: session.siwe,
        signature: session.signature,
        daoLogin: session.daoLogin,
        ens: session.ens,
        lens: session.lens,
      };

      if (ssx.authenticationMethod === SSXAuthenticationMethod.COOKIES) {
        Object.assign(req.session, payload);
        req.session.save(() => res.status(200).json({ ...req.session }));
      } else {
        req.session.destroy(null);
        res.status(200).json({
          jwt: ssx.getJWT(payload),
        });
      }

      return;
    }
  );

  /**
   * This endpoint removes the session token `ssx-session` from the client, effectively logging the client out.
   * @name /ssx-logout
   * @param {Request} req
   * @param {Response} res
   */
  router.post(
    routes?.logout ?? '/ssx-logout',
    async function (req: Request, res: Response) {
      try {
        req.session.destroy(null);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
      req.session = null;
      try {
        await req.ssx.logout();
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
      res.status(204).send();
    }
  );

  return router;
};

export default ssxEndpoints;

import { getCsrfToken, signIn, signOut } from 'next-auth/react';
import type { SSXClientSession } from '@spruceid/ssx';

/** Approach A */
export const SSXNextAuthRouteConfig = () => {
  const nonce = {
    customOperation: async () => {
      return await getCsrfToken();
    },
  };
  const login = {
    customOperation: async (session: SSXClientSession) => {
      const callbackUrl = '/protected';
      const { siwe, signature } = session;
      return signIn('credentials', {
        message: siwe,
        redirect: false,
        signature,
        callbackUrl,
      });
    },
  };
  const logout = {
    customOperation: async (data: any) => {
      return signOut(data);
    },
  };

  const routes = { nonce, login, logout };
  const host = '/api/auth';
  const server = { host, routes };

  return { ...routes, ...server, server };
};

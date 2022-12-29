import { getCsrfToken, signIn, signOut } from 'next-auth/react';
import type { SSXClientSession } from '@spruceid/ssx';

/** Approach A */
export const SSXNextAuthRouteConfig = () => {
  const nonce = {
    customOperation: async () => { 
      console.log("SSXNextAuthRouteConfig: nonce")
      return await getCsrfToken();
    },
  };
  const login = {
    customOperation: async (session: SSXClientSession) => {
      console.log("SSXNextAuthRouteConfig: login")
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
      console.log("SSXNextAuthRouteConfig: logout")
      return signOut(data);
    },
  };

  const routes = { nonce, login, logout };
  const host = '/api/auth';
  const server = { host, routes };

  return { ...routes, ...server, server };
};

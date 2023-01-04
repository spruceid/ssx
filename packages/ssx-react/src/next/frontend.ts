import { getCsrfToken, signIn, signOut, SignOutParams } from 'next-auth/react';
import type { SSXClientSession } from '@spruceid/ssx';

interface SSXNextAuthRouteConfig {
  getCsrfTokenParams?: any;
  signOutParams?: SignOutParams;
}

/** Approach A */
export const SSXNextAuthRouteConfig = (config?: SSXNextAuthRouteConfig) => {
  const nonce = {
    customOperation: async () => {
      return await getCsrfToken(config?.getCsrfTokenParams);
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
    // customOperation: async (data?: any) => {
    //   console.log("customOperation: logout")
    //   return signOut(config?.signOutParams);
    // },
    url: '/signout',
    method: 'POST',
  };

  const routes = { nonce, login, logout };
  const host = '/api/auth';
  const server = { host, routes };

  return { ...routes, ...server, server };
};

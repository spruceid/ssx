import { getCsrfToken, signIn, SignInOptions } from 'next-auth/react';
import type { SSXClientSession } from '@spruceid/ssx';

interface SSXNextAuthRouteConfig {
  getCsrfTokenParams?: any;
  signInOptions?: SignInOptions;
}

/** Approach A */
export const SSXNextAuthRouteConfig = (config?: SSXNextAuthRouteConfig) => {
  const nonce = {
    customAPIOperation: async () => {
      return await getCsrfToken(config?.getCsrfTokenParams);
    },
  };
  const login = {
    customAPIOperation: async (session: SSXClientSession) => {
      const { siwe, signature } = session;
      return signIn('credentials', {
        message: siwe,
        redirect: false,
        signature,
        ...config?.signInOptions,
      });
    },
  };
  const logout = {
    url: '/signout',
    method: 'POST',
  };

  const routes = { nonce, login, logout };
  const host = '/api/auth';
  const server = { host, routes };

  return { ...routes, ...server, server };
};

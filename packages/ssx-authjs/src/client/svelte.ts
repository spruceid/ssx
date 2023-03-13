import { SSXAuthRouteConfigOptions } from '../types.js';

export const SSXSvelteAuthRouteConfig = (config?: SSXAuthRouteConfigOptions) => {
  const login = {
    customAPIOperation: async (session) => {
      const { siwe, signature } = session;
      console.log("session", session);
      
      return import('@auth/sveltekit/client')
        .then(svelteKitClient => {
          return svelteKitClient.signIn('credentials', {
            message: siwe,
            redirect: false,
            signature,
            daoLogin: false,
            resolveEns: false,
          });
        })
    },
  };
  const routes = { login } ;
  const server = { host: 'http://localhost:5173', routes };

  return { server};
};

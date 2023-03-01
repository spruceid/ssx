import { SvelteKitAuth } from "@auth/sveltekit"
import Credentials from "@auth/core/providers/credentials"
import { SSXServer } from "@spruceid/ssx-server";
import { generateNonce } from "siwe";

export const SSXSvelteAuth = (
  cookies: any,
  ssx: SSXServer
) => {
  const credentials = {
    message: {
      label: 'Message',
      type: 'text',
      placeholder: '0x0',
    },
    signature: {
      label: 'Signature',
      type: 'text',
      placeholder: '0x0',
    },
    daoLogin: {
      label: 'daoLogin',
      type: 'boolean',
      placeholder: 'false',
    },
    resolveEns: {
      label: 'resolveEns',
      type: 'boolean',
      placeholder: 'false',
    },
  };

  const authorize = async (credentials: any) => {
    try {

      const nonce = cookies.get('nonce');

      // validate signature, nonce and ssx config options
      const { success, error, session } = await ssx.login(
        credentials?.message || '',
        credentials?.signature || '',
        JSON.parse(credentials?.daoLogin || 'false'),
        JSON.parse(credentials?.resolveEns || 'false'),
        nonce || ''
      );
      const { siwe, signature, daoLogin, ens } = session;
      if (!siwe) return null;

      //  // check domain
      //  const nextAuthUrl = new URL(process.env.DOMAIN as string);
      //  if (siwe.domain !== nextAuthUrl.host) {
      //     return null;
      //  }

      if (success) {
        return {
          id: `did:pkh:eip155:${siwe.chainId}:${siwe.address}`,
          name: ens?.domain || siwe.address,
          image: ens?.avatarUrl,
          address: siwe.address,
          test: 'woo',
        };
      }
    } catch (e) {
      console.error(e);
      return null;
    }
    return null;
  };

  const session = async (sessionData: any) => {
    const { session, user, token } = sessionData;
    if (session.user) {
      session.user.name = token.sub;
    }

    return session;
  };

  return { credentials, authorize, session };
};


const ssx = new SSXServer({});

export const handle = (params) => {
  const { credentials, authorize } = SSXSvelteAuth(params.event.cookies, ssx);

  if (params.event.url.pathname === "/ssx-nonce") {
    const nonce = generateNonce();
    params.event.cookies.set('nonce', nonce, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // one week
    });
    return new Response(nonce, { status: 200, });
  }

  return SvelteKitAuth({
    providers: [
      Credentials({
        credentials,
        authorize,
      }
      )
    ],
  })(params);
}
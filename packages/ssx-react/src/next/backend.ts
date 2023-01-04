import { NextApiRequest, NextApiResponse } from 'next';
import { getCsrfToken } from 'next-auth/react';
import { SSXServer } from '@spruceid/ssx-server';
import type { SSXServerConfig } from '@spruceid/ssx-server';

export const SSXNextAuth = (
  req: NextApiRequest,
  res: NextApiResponse,
  ssxConfig: SSXServerConfig = {}
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

  const authorize = async credentials => {
    try {
      const ssx = new SSXServer(ssxConfig);
      const nonce = await getCsrfToken({ req });

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

  const session = async sessionData => {
    const { session, user, token } = sessionData;
    if (session.user) {
      session.user.name = token.sub;
    }

    return session;
  };

  return { credentials, authorize, session };
};

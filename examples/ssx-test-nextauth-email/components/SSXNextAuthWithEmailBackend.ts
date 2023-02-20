import { NextApiRequest, NextApiResponse } from 'next';
import { getCsrfToken } from 'next-auth/react';
import { SSXServer } from '@spruceid/ssx-server';
import { Session, User } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import { JWT } from 'next-auth/jwt';

export const SSXNextAuthWithEmail = (
  req: NextApiRequest,
  res: NextApiResponse,
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

  const authorize = async (credentials: Credentials | undefined) => {
    try {
      const nonce = await getCsrfToken({ req });

      // validate signature, nonce and ssx config options
      const { success, session } = await ssx.login(
        credentials?.message || '',
        credentials?.signature || '',
        JSON.parse(credentials?.daoLogin || 'false'),
        JSON.parse(credentials?.resolveEns || 'false'),
        nonce || ''
      );

      const { siwe, ens } = session;
      
      if (!siwe || !success) return null;
      
      const web3Address = `did:pkh:eip155:${siwe.chainId}:${siwe.address}`;
      const user = await prisma?.user.findUnique({
        where: {
          web3Address
        }
      });

      if (!user) return null;

      return {
        name: ens?.domain || siwe.address,
        image: ens?.avatarUrl,
        address: web3Address,
        id: user.id
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const session = async ({ session, token }: SessionData) => {
    const user = await prisma?.user.findUnique({
      where: {
        id: token.sub
      }
    });
    return {
      ...session,
      user
    };
  };

  return { credentials, authorize, session };
};

interface Credentials {
  message: string;
  signature: string;
  daoLogin: string;
  resolveEns: string;
};

interface SessionData {
  session: Session;
  user: User | AdapterUser;
  token: JWT;
};
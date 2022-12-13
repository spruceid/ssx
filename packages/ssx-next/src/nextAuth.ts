import type { CredentialsConfig } from 'next-auth/providers/credentials';
import { SiweMessage, SSXServer } from '@spruceid/ssx-server';

const ssxCredentialProviderOptions: CredentialsConfig = {
  name: 'Ethereum',
  credentials: {
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
  },
  async authorize(credentials) {
    try {
      const siwe = new SiweMessage(JSON.parse(credentials?.message || '{}'));
      const nextAuthUrl = new URL(process.env.DOMAIN as string);
      if (siwe.domain !== nextAuthUrl.host) {
        return null;
      }

      if (siwe.nonce !== (await getCsrfToken({ req }))) {
        return null;
      }

      await siwe.validate(credentials?.signature || '');
      return {
        id: siwe.address,
      };
    } catch (e) {
      return null;
    }
  },
};

// export ssxCredentialProviderOptions, authorize function, session function,

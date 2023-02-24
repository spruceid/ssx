---
description: Getting started authenticating using SSX and NextAuth
---

# Using SSX with NextAuth

## Overview

This guide provides an example of how to set up your dapp to authenticate your users using SSX and NextAuth. [NextAuth](https://authjs.dev/) allows you to authenticate with multiple identity providers, and SSX enables you to add Sign-in with Ethereum authentication to your Next.js dapp easily.

### Prerequisites

This example follows along the [`ssx-test-nextauth`](https://github.com/spruceid/ssx/tree/main/examples/ssx-test-nextauth) example implementation, built with `npm init @rainbow-me/create-rainbowkit@0.1.3` .

#### Install Dependencies

Install [`ssx`](https://www.npmjs.com/package/@spruceid/ssx-react) and [`next-auth`](https://next-auth.js.org/getting-started/example#existing-project) with your package manager of choice:

```
npm install @spruceid/ssx-react @spruceid/ssx-server next-auth
```

## Add NextAuth API Routes

In your dapp, we will add an API route (`pages/api/auth/[...nextauth].ts`) for NextAuth and configure it with SSX. SSX provides configured `credentials` and `authorize` functions to create a NextAuth provider. SSX also provides a `session` function, but it is likely you will want to modify the contents of the function to provide specific session data from the server to the frontend client.

```typescript
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SSXNextAuth } from "@spruceid/ssx-react/next-auth/backend";
import { SSXServer } from "@spruceid/ssx-server";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const ssxConfig = {};
  const ssx = new SSXServer(ssxConfig);
  const { credentials, authorize } = SSXNextAuth(req, res, ssx);
  
  const providers = [
    CredentialsProvider({
      name: "Ethereum",
      credentials,
      authorize,
    }),
  ];

  return await NextAuth(req, res, {
    providers,
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXT_AUTH_SECRET,
    callbacks: {
     session: (sessionData) => {
        const { session, user, token } = sessionData;
        if (session.user) {
            session.user.name = token.sub;
        }
        return session;
      },
    },
  });
}
```

## Add Providers to the Frontend

Next, you'll add the SSX provider and NextAuth Session provider to the frontend. This is done in the `pages/_app.tsx` file. Adding the providers here makes them available for any child component to access the session data.

```typescript
import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { SSXProvider } from '@spruceid/ssx-react';
import { SSXNextAuthRouteConfig } from '@spruceid/ssx-react/next-auth/frontend';
import { SessionProvider } from "next-auth/react";


const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.mainnet,
    chain.polygon,
    chain.optimism,
    chain.arbitrum,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
      ? [chain.goerli, chain.kovan, chain.rinkeby, chain.ropsten]
      : []),
  ],
  [
    alchemyProvider({
      // This is Alchemy's default API key.
      // You can get your own at https://dashboard.alchemyapi.io
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const { server } = SSXNextAuthRouteConfig({ signInOptions: { callbackUrl:'/protected' }});
const ssxConfig: any = {
  siweConfig: {
    domain: "localhost:3000",
  },
  providers: { 
    server,
  },
};


function MyApp({ Component, pageProps }: any) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <SSXProvider ssxConfig={ssxConfig}> 
          <SessionProvider session={pageProps.session} refetchInterval={0}>
            <Component {...pageProps} />
          </SessionProvider>
        </SSXProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;

```

## Using SSX + NextAuth Sessions in your dapp

Now that you've set up the SSX and NextAuth Providers, you can use their corresponding hooks to access user information to protect pages from unauthorized access! The following is an example page:

```typescript
import React from "react";
import styles from '../styles/Protected.module.css'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useSSX } from "@spruceid/ssx-react";


export default function Protected() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { ssx, ssxLoaded } = useSSX();

    const signOut = async () => {
        await ssx?.signOut();
        router.push('/')
    }
    

    if (status === "loading") {
        <div className={styles.container}>
            <h2 className={styles.title}>Protected Page</h2>
            <p className={styles.description}>Loading</p>
        </div>
      }
    
      if (status === "unauthenticated") {
         return (<div className={styles.container}>
            <h2 className={styles.title}>Protected Page</h2>
            <p className={styles.description}>
            This page is only accessible to authenticated users.
            </p>
        </div>)
      }
      
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Protected Page</h2>
            <p className={styles.description}>
            You are Authenticated as <br/>
            {session?.user?.name}
            </p>
            <button onClick={signOut} disabled={!ssxLoaded}>Log Out</button>
        </div>
    )
}
```

## Wrap up

Now that you have authentication in your dapp, take a deeper dive into some of the capabilities SSX gives you, like [signing in on behalf of a multisig](../configuring-ssx/#enabling-dao-login), [resolving ENS/Lens names](../configuring-ssx/#resolveens), or [customizing the SIWE message.](../configuring-ssx/#customizing-fields-in-the-siwe-message)&#x20;

Have any questions? Hop into the [Spruce discord](https://discord.gg/tKT6kA6hjV) and ask!

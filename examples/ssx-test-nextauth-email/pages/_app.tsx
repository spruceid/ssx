import '../styles/globals.scss';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { SSXProvider } from '@spruceid/ssx-react';
import { SSXNextAuthRouteConfig } from '@spruceid/ssx-react/next-auth/frontend';
import { SessionProvider } from "next-auth/react";
import Head from 'next/head';
import { useEffect } from 'react';

declare global {
  interface Window {
    explode: (rect: DOMRect) => void;
    createFireworks: (rect: DOMRect) => void;
    deleteFireworks: () => void;
  }
}

if (!process.env.NEXT_PUBLIC_ALCHEMY_API_KEY) {
  console.error('Missing NEXT_PUBLIC_ALCHEMY_API_KEY environment variable. Add to .env.local');
}

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

const { server } = SSXNextAuthRouteConfig({ signInOptions: { callbackUrl: '/protected' } });
const ssxConfig: any = {
  siweConfig: {
    domain: "localhost:3000",
  },
  providers: {
    server,
  },
};


function MyApp({ Component, pageProps }: any) {

  useEffect(() => {
    window.createFireworks = (rect: DOMRect) => {
      const xPos: number = rect.left + (rect.width / 2);
      const yPos: number = rect.top + (rect.height / 2);
      for (let i = 1; i <= 20; i++) {
        const firework = document.createElement('img');
        firework.src = '/logo.svg';
        firework.className = 'firework';
        firework.classList.add(`firework${i}`);
        firework.style.left = xPos + 'px';
        firework.style.top = yPos + 'px';
        document.body.appendChild(firework);
      }
    }

    window.deleteFireworks = () => {
      const fireworks = document.querySelectorAll(`.firework`);
      fireworks.forEach(firework => {
        firework.remove();
      });
    }

    window.explode = (rect: DOMRect) => {
      window.createFireworks(rect);
      setTimeout(() => {
        window.deleteFireworks()
      }, 1000);
    }
  }, []);

  return (
    <>
      <Head>
        <title>SSX NextAuth + Email</title>
        <meta
          name="description"
          content="SSX powered dapp + NextAuth with Email"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <SSXProvider ssxConfig={ssxConfig}>
            <SessionProvider session={pageProps.session} refetchInterval={0}>
              <Component {...pageProps} />
            </SessionProvider>
          </SSXProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

export default MyApp;

import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { SSXProvider } from '@spruceid/ssx-react';
import { SSXNextAuthRouteConfig } from '@spruceid/ssx-authjs/client';
import { SessionProvider } from "next-auth/react";


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

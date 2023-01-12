import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig, useSigner } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, goerli } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { SSXProvider } from '@spruceid/ssx-react';


const { chains, provider, webSocketProvider } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
  ],
  [
    alchemyProvider({
      // This is Alchemy's default API key.
      // You can get your own at https://dashboard.alchemyapi.io
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '',
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
 
const ssxConfig = {
  siweConfig: {
    domain: "localhost:3000",
  },
};

function SSXWithWeb3Provider({ children }: any) {
  const { data: provider, isSuccess: providerLoaded } = (typeof window !== 'undefined' &&
    useSigner()) || { data: undefined, isSuccess: false };

  const web3Provider = {
    provider: provider?.provider,
    providerLoaded,
  };

  return (
    <SSXProvider ssxConfig={ssxConfig} web3Provider={web3Provider}> 
      {children}
    </SSXProvider>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        {/* <SSXWithWeb3Provider >
          <Component {...pageProps} />
        </SSXWithWeb3Provider> */}

        {/* SSX Provider with default Wagmi usage */}
        <SSXProvider ssxConfig={ssxConfig}> 
          <Component {...pageProps} />
        </SSXProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;

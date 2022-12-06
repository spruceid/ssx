import '../styles/globals.css'
import { Web3OnboardProvider, init, useConnectWallet } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import { SSXProvider } from '@spruceid/ssx-react';

const INFURA_KEY = process.env.INFURA_ID;

const ethereumRopsten = {
  id: '0x3',
  token: 'rETH',
  label: 'Ethereum Ropsten',
  rpcUrl: `https://ropsten.infura.io/v3/${INFURA_KEY}`
}

const polygonMainnet = {
  id: '0x89',
  token: 'MATIC',
  label: 'Polygon',
  rpcUrl: 'https://matic-mainnet.chainstacklabs.com'
}

const chains = [ethereumRopsten, polygonMainnet]
const wallets = [injectedModule()]

const web3Onboard = init({
  wallets,
  chains,
  appMetadata: {
    name: "Web3-Onboard Demo",
    icon: '<svg>My App Icon</svg>',
    description: "A demo of Web3-Onboard."
  }
})

function SSXWithWeb3Provider({ children }) {
  const [{ wallet }] = useConnectWallet();

  const web3Provider = {
    provider: wallet?.provider,
    providerLoaded: !!wallet?.provider,
  };

  const ssxConfig = {
    siweConfig: {
      domain: "localhost:3000",
    },
  };

  return (
    <SSXProvider ssxConfig={ssxConfig} web3Provider={web3Provider}> 
      {children}
    </SSXProvider>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <Web3OnboardProvider web3Onboard={web3Onboard}>
      <SSXWithWeb3Provider>
        <Component {...pageProps} />
      </SSXWithWeb3Provider>
    </Web3OnboardProvider>
  )
}

export default MyApp
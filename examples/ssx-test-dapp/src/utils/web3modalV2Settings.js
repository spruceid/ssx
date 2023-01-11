import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider
} from '@web3modal/ethereum';
import {
  configureChains,
  createClient,
} from 'wagmi';
import {
  arbitrum,
  avalanche,
  bsc,
  fantom,
  mainnet,
  optimism,
  polygon
} from 'wagmi/chains';


// 1. Get projectID at https://cloud.walletconnect.com
if (!process.env.REACT_APP_PROJECT_ID) {
  console.error('You need to provide REACT_APP_PROJECT_ID env variable');
}

export const projectId = process.env.REACT_APP_PROJECT_ID;

// 2. Configure wagmi client
const chains = [mainnet, polygon, optimism, arbitrum, avalanche, fantom, bsc];

const {
  provider
} = configureChains(chains, [walletConnectProvider({
  projectId
})]);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    appName: 'web3Modal',
    chains
  }),
  provider
});

// 3. Configure modal ethereum client
export const ethereumClient = new EthereumClient(wagmiClient, chains);

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider
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
  polygon, 
  goerli,
} from 'wagmi/chains';


// 1. Get projectID at https://cloud.walletconnect.com
if (!process.env.REACT_APP_PROJECT_ID) {
  console.error('You need to provide REACT_APP_PROJECT_ID env variable');
}

export const projectId = process.env.REACT_APP_PROJECT_ID;

// 2. Configure wagmi client
const chains = [mainnet, goerli, polygon, optimism, arbitrum, avalanche, fantom, bsc];

const {
  provider
} = configureChains(chains, [w3mProvider({
  projectId
})]);

export const wagmiClient = createClient({
  autoConnect: false,
  connectors: w3mConnectors({
    projectId,
    version: 1,
    chains
  }),
  provider
});

// 3. Configure modal ethereum client
export const ethereumClient = new EthereumClient(wagmiClient, chains);

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider
} from '@web3modal/ethereum';
import {
  configureChains,
  createConfig,
} from 'wagmi';
import {
  polygon,
  mainnet, 
  goerli,
  sepolia,
} from 'wagmi/chains'; 
import { type WalletClient } from '@wagmi/core';
import { providers } from 'ethers';

// 1. Get projectID at https://cloud.walletconnect.com
if (!process.env.REACT_APP_PROJECT_ID) {
  console.error('You need to provide REACT_APP_PROJECT_ID env variable');
}

export const projectId = process.env.REACT_APP_PROJECT_ID ?? "";

// 2. Configure wagmi client
const chains = [mainnet, goerli, sepolia, polygon];

const {
  publicClient
} = configureChains(chains, [w3mProvider({
  projectId
})]);

export const wagmiConfig = createConfig({
  autoConnect: false,
  connectors: w3mConnectors({
    projectId,
    chains
  }),
  publicClient
});

// 3. Configure modal ethereum client
export const ethereumClient = new EthereumClient(wagmiConfig, chains);

export function walletClientToEthers5Signer(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new providers.Web3Provider(transport, network)
  const signer = provider.getSigner(account.address)
  return signer
}
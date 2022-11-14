import {
  isSSXAlchemyProvider,
  isSSXAnkrProvider,
  isSSXCloudflareProvider,
  isSSXCustomProvider,
  isSSXEtherscanProvider,
  isSSXInfuraProvider,
  isSSXPocketProvider,
  SSXAlchemyProviderNetworks,
  SSXAnkrProviderNetworks,
  SSXEtherscanProviderNetworks,
  SSXInfuraProviderNetworks,
  SSXPocketProviderNetworks,
  SSXRPCProvider,
} from './types';
import { ethers, getDefaultProvider } from 'ethers';

/**
 * Returns an ethers provider based on the RPC configuration
 */
export const getProvider = (rpc?: SSXRPCProvider): ethers.providers.BaseProvider => {
  if(!rpc) {
    return getDefaultProvider();
  }
  if (isSSXEtherscanProvider(rpc)) {
    return new ethers.providers.EtherscanProvider(
      rpc.network ?? SSXEtherscanProviderNetworks.MAINNET,
      rpc.apiKey,
    );
  }
  if (isSSXInfuraProvider(rpc)) {
    return new ethers.providers.InfuraProvider(
      rpc.network ?? SSXInfuraProviderNetworks.MAINNET,
      rpc.apiKey,
    );
  }
  if (isSSXAlchemyProvider(rpc)) {
    return new ethers.providers.AlchemyProvider(
      rpc.network ?? SSXAlchemyProviderNetworks.MAINNET,
      rpc.apiKey,
    );
  }
  if (isSSXCloudflareProvider(rpc)) {
    return new ethers.providers.CloudflareProvider();
  }
  if (isSSXPocketProvider(rpc)) {
    return new ethers.providers.PocketProvider(
      rpc.network ?? SSXPocketProviderNetworks.MAINNET,
      rpc.apiKey,
    );
  }
  if (isSSXAnkrProvider(rpc)) {
    return new ethers.providers.AnkrProvider(
      rpc.network ?? SSXAnkrProviderNetworks.MAINNET,
      rpc.apiKey,
    );
  }
  if (isSSXCustomProvider(rpc)) {
    return new ethers.providers.JsonRpcProvider(rpc.url, rpc.network);
  }
  return getDefaultProvider();
};

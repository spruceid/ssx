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
  SSXEnsData,
  SSXEtherscanProviderNetworks,
  SSXInfuraProviderNetworks,
  SSXPocketProviderNetworks,
  SSXRPCProvider,
} from './types';
import { ethers, getDefaultProvider } from 'ethers';

/**
 * @param rpc - SSXRPCProvider
 * @returns an ethers provider based on the RPC configuration.
 */
export const getProvider = (
  rpc?: SSXRPCProvider
): ethers.providers.BaseProvider => {
  if (!rpc) {
    return getDefaultProvider();
  }
  if (isSSXEtherscanProvider(rpc)) {
    return new ethers.providers.EtherscanProvider(
      rpc.network ?? SSXEtherscanProviderNetworks.MAINNET,
      rpc.apiKey
    );
  }
  if (isSSXInfuraProvider(rpc)) {
    return new ethers.providers.InfuraProvider(
      rpc.network ?? SSXInfuraProviderNetworks.MAINNET,
      rpc.apiKey
    );
  }
  if (isSSXAlchemyProvider(rpc)) {
    return new ethers.providers.AlchemyProvider(
      rpc.network ?? SSXAlchemyProviderNetworks.MAINNET,
      rpc.apiKey
    );
  }
  if (isSSXCloudflareProvider(rpc)) {
    return new ethers.providers.CloudflareProvider();
  }
  if (isSSXPocketProvider(rpc)) {
    return new ethers.providers.PocketProvider(
      rpc.network ?? SSXPocketProviderNetworks.MAINNET,
      rpc.apiKey
    );
  }
  if (isSSXAnkrProvider(rpc)) {
    return new ethers.providers.AnkrProvider(
      rpc.network ?? SSXAnkrProviderNetworks.MAINNET,
      rpc.apiKey
    );
  }
  if (isSSXCustomProvider(rpc)) {
    return new ethers.providers.JsonRpcProvider(rpc.url, rpc.network);
  }
  return getDefaultProvider();
};

/**
 * Resolves ENS data supported by SSX.
 * @param provider - Ether provider.
 * @param address - User address.
 * @param address - User address.
 * @param resolveEnsOpts - Options to resolve ENS.
 * @returns Object containing ENS data.
 */
export const ssxResolveEns = async (
  provider: ethers.providers.BaseProvider,
  /* User Address */
  address: string,
  resolveEnsOpts: {
    /* Enables ENS domain/name resolution */
    domain?: boolean;
    /* Enables ENS avatar resolution */
    avatar?: boolean;
  } = {
    domain: true,
    avatar: true,
  }
): Promise<SSXEnsData> => {
  if (!address) {
    throw new Error('Missing address.');
  }
  const ens: SSXEnsData = {};
  const promises: Array<Promise<any>> = [];
  if (resolveEnsOpts?.domain) {
    promises.push(provider.lookupAddress(address));
  }
  if (resolveEnsOpts?.avatar) {
    promises.push(provider.getAvatar(address));
  }

  await Promise.all(promises).then(([domain, avatarUrl]) => {
    if (!resolveEnsOpts.domain && resolveEnsOpts.avatar) {
      [domain, avatarUrl] = [undefined, domain];
    }
    if (domain) {
      ens['domain'] = domain;
    }
    if (avatarUrl) {
      ens['avatarUrl'] = avatarUrl;
    }
  });

  return ens;
};

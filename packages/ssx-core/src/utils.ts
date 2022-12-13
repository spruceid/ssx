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
  SSXLensProfilesResponse,
  SSXPocketProviderNetworks,
  SSXRPCProvider,
} from './types';
import { ethers, getDefaultProvider } from 'ethers';
import axios from 'axios';

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
 * @param provider - Ethers provider.
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

const LENS_API_LINKS = {
  'matic':'https://api.lens.dev',
  'maticmum': 'https://api-mumbai.lens.dev'
}

/**
 * Resolves Lens profiles owned by the given Ethereum Address. Each request is 
 * limited by 10. To get other pages you must to pass the pageCursor parameter.
 * @param address - Ethereum User address.
 * @param pageCursor - Page cursor used to paginate the request. Default to 
 * first page. Visit https://docs.lens.xyz/docs/get-profiles#api-details for more 
 * information.
 * @returns Object containing Lens profiles items and pagination info.
 */
export const ssxResolveLens = async (
  provider: ethers.providers.BaseProvider,
  /* Ethereum User Address. */
  address: string,
  /* Page cursor used to paginate the request. Default to first page. */
  pageCursor: string = "{}"
): Promise<SSXLensProfilesResponse | string> => {

  if (!address) {
    throw new Error('Missing address.');
  }

  const networkName = (await provider.getNetwork()).name;
  const apiURL: string | null = LENS_API_LINKS[networkName];

  if(!apiURL) {
    return `Can not resolve Lens to ${address} on network '${networkName}'. Please use 'matic' (Polygon) or 'maticmum' (Mumbai) instead.`;
  }

  let lens: { data: { profiles: SSXLensProfilesResponse } };
  try {
    lens = (await axios({
      url: apiURL,
      method: 'post',
      data: {
        operationName: 'Profiles',
        query: `
            query Profiles($addresses: [EthereumAddress!], $cursor: Cursor) {
              profiles(request: { ownedBy: $addresses, limit: 10, cursor: $cursor }) {
                items {
                  id
                  name
                  bio
                  attributes {
                    displayType
                    traitType
                    key
                    value
                  }
                  followNftAddress
                  metadata
                  isDefault
                  picture {
                    ... on NftImage {
                      contractAddress
                      tokenId
                      uri
                      verified
                    }
                    ... on MediaSet {
                      original {
                        url
                        mimeType
                      }
                    }
                    __typename
                  }
                  handle
                  coverPicture {
                    ... on NftImage {
                      contractAddress
                      tokenId
                      uri
                      verified
                    }
                    ... on MediaSet {
                      original {
                        url
                        mimeType
                      }
                    }
                    __typename
                  }
                  ownedBy
                  dispatcher {
                    address
                    canUseRelay
                  }
                  stats {
                    totalFollowers
                    totalFollowing
                    totalPosts
                    totalComments
                    totalMirrors
                    totalPublications
                    totalCollects
                  }
                  followModule {
                    ... on FeeFollowModuleSettings {
                      type
                      amount {
                        asset {
                          symbol
                          name
                          decimals
                          address
                        }
                        value
                      }
                      recipient
                    }
                    ... on ProfileFollowModuleSettings {
                    type
                    }
                    ... on RevertFollowModuleSettings {
                    type
                    }
                  }
                }
                pageInfo {
                  prev
                  next
                  totalCount
                }
              }
            }
        `,
        variables: {
          addresses: [address],
          cursor: pageCursor
        }
      },
    })).data;
  } catch (err) {
    throw new Error(err?.response?.data?.errors ?? err);
  }
  return lens.data.profiles;
};

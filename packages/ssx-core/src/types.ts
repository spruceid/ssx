import { providers } from 'ethers';
import { ConnectionInfo } from 'ethers/lib/utils';
import { SSXClientSession } from './client';
import type { AxiosRequestConfig } from 'axios';
import type { Request } from 'express';
import type { IncomingMessage } from 'http';

/** SSX Route Configuration
 *  This configuration is used to override the default endpoint paths.
 * The config options here are a subset of the
 * [AxiosRequestConfig](https://axios-http.com/docs/req_config).
 * This type does not explicitly extend AxiosRequestConfig,
 * but those options are supported by the client.
 */
export interface SSXRouteConfig {
  /** Endpoint path. */
  url?: string;
  /** Endpoint request method. */
  method?: 'get' | 'post' | 'put' | 'delete';
  /** Custom Operation.
   * Replace the ssx function called with a function of your own
   **/
  customAPIOperation?(
    params: SSXClientSession | Record<string, any> | any
  ): Promise<any>;
}

/** Type-Guard for SSXRouteConfig. */
export const isSSXRouteConfig = (
  config: SSXServerRouteEndpointType
): config is SSXRouteConfig | AxiosRequestConfig | SSXServerMiddlewareConfig =>
  typeof config === 'object';

export interface SSXServerMiddlewareConfig {
  path: string;
  callback?: (req: any, body?: Record<string, any>) => Promise<void> | void;
}

/** Type-Guard for SSXServerMiddlewareConfig. */
export const isSSXServerMiddlewareConfig = (
  config: SSXServerRouteEndpointType
): config is SSXServerMiddlewareConfig =>
  (config as SSXServerMiddlewareConfig)?.path !== undefined;

export type SSXServerRouteEndpointType =
  | Partial<SSXRouteConfig>
  | AxiosRequestConfig
  | string
  | SSXServerMiddlewareConfig;

/** Server endpoints configuration. */
export interface SSXServerRoutes {
  /** Get nonce endpoint path. /ssx-nonce as default. */
  nonce?: SSXServerRouteEndpointType;
  /** Post login endpoint path. /ssx-login as default. */
  login?: SSXServerRouteEndpointType;
  /** Post logout endpoint path. /ssx-logout as default. */
  logout?: SSXServerRouteEndpointType;
}

/** Server endpoints name configuration. */
export interface SSXServerRouteNames {
  /** Get nonce endpoint path. /ssx-nonce as default. */
  nonce?: string;
  /** Post login endpoint path. /ssx-login as default. */
  login?: string;
  /** Post logout endpoint path. /ssx-logout as default. */
  logout?: string;
}

/** Supported provider types. */
export type SSXRPCProvider =
  | SSXGenericProvider
  | SSXEtherscanProvider
  | SSXInfuraProvider
  | SSXAlchemyProvider
  | SSXCloudflareProvider
  | SSXPocketProvider
  | SSXAnkrProvider
  | SSXCustomProvider;

/** Enum of supported EthersJS providers. */
export enum SSXRPCProviders {
  SSXAlchemyProvider = 'alchemy',
  SSXAnkrProvider = 'ankr',
  SSXCloudflareProvider = 'cloudflare',
  SSXCustomProvider = 'custom',
  SSXEtherscanProvider = 'etherscan',
  SSXInfuraProvider = 'infura',
  SSXPocketProvider = 'pocket',
}

/** Enum of supported networks for Etherscan. */
export enum SSXEtherscanProviderNetworks {
  MAINNET = 'homestead',
  ROPSTEN = 'ropsten',
  RINKEBY = 'rinkeby',
  GOERLI = 'goerli',
  KOVAN = 'kovan',
}

/** Etherscan provider settings. */
export type SSXEtherscanProvider = {
  service: SSXRPCProviders.SSXEtherscanProvider;
  apiKey?: string;
  network?: SSXEtherscanProviderNetworks;
};

/* Type-Guard for SSXEtherScanProvider. */
export const isSSXEtherscanProvider = (
  provider: SSXRPCProvider
): provider is SSXEtherscanProvider =>
  provider.service === SSXRPCProviders.SSXEtherscanProvider;

/** Enum of supported networks for Infura. */
export enum SSXInfuraProviderNetworks {
  MAINNET = 'homestead',
  ROPSTEN = 'ropsten',
  RINKEBY = 'rinkeby',
  GOERLI = 'goerli',
  KOVAN = 'kovan',
  POLYGON = 'matic',
  POLYGON_MUMBAI = 'maticmum',
  OPTIMISM = 'optimism',
  OPTIMISM_KOVAN = 'optimism-kovan',
  ARBITRUM = 'arbitrum',
  ARBITRUM_RINKEBY = 'arbitrum-rinkeby',
}

/** Infura provider project settings. */
export type SSXInfuraProviderProjectSettings = {
  projectId: string;
  projectSecret: string;
};

/** Infura provider settings. */
export type SSXInfuraProvider = {
  service: SSXRPCProviders.SSXInfuraProvider;
  apiKey: string | SSXInfuraProviderProjectSettings;
  network?: SSXInfuraProviderNetworks;
};

/* Type-Guard for SSXInfuraProvider. */
export const isSSXInfuraProvider = (
  provider: SSXRPCProvider
): provider is SSXInfuraProvider =>
  provider.service === SSXRPCProviders.SSXInfuraProvider;

/** Enum of supported networks for Alchemy. */
export enum SSXAlchemyProviderNetworks {
  MAINNET = 'homestead',
  ROPSTEN = 'ropsten',
  RINKEBY = 'rinkeby',
  GOERLI = 'goerli',
  KOVAN = 'kovan',
  POLYGON = 'matic',
  POLYGON_MUMBAI = 'maticmum',
  OPTIMISM = 'optimism',
  OPTIMISM_KOVAN = 'optimism-kovan',
  ARBITRUM = 'arbitrum',
  ARBITRUM_RINKEBY = 'arbitrum-rinkeby',
}

/** Alchemy provider settings. */
export type SSXAlchemyProvider = {
  service: SSXRPCProviders.SSXAlchemyProvider;
  apiKey?: string;
  network?: SSXAlchemyProviderNetworks;
};

/* Type-Guard for SSXAlchemyProvider. */
export const isSSXAlchemyProvider = (
  provider: SSXRPCProvider
): provider is SSXAlchemyProvider =>
  provider.service === SSXRPCProviders.SSXAlchemyProvider;

/** Cloudflare provider settings. */
export type SSXCloudflareProvider = {
  service: SSXRPCProviders.SSXCloudflareProvider;
};

/* Type-Guard for SSXCloudflareProvider. */
export const isSSXCloudflareProvider = (
  provider: SSXRPCProvider
): provider is SSXCloudflareProvider =>
  provider.service === SSXRPCProviders.SSXCloudflareProvider;

/** Enum of supported networks for Pocket. */
export enum SSXPocketProviderNetworks {
  MAINNET = 'homestead',
  ROPSTEN = 'ropsten',
  RINKEBY = 'rinkeby',
  GOERLI = 'goerli',
}

/** Pocket provider settings. */
export type SSXPocketProvider = {
  service: SSXRPCProviders.SSXPocketProvider;
  apiKey?: string;
  network?: SSXPocketProviderNetworks;
};

/** Type-Guard for SSXPocketProvider. */
export const isSSXPocketProvider = (
  provider: SSXRPCProvider
): provider is SSXPocketProvider =>
  provider.service === SSXRPCProviders.SSXPocketProvider;

/** Enum of supported networks for Ankr. */
export enum SSXAnkrProviderNetworks {
  MAINNET = 'homestead',
  POLYGON = 'matic',
  ARBITRUM = 'arbitrum',
}

/** Ankr provider settings. */
export type SSXAnkrProvider = {
  service: SSXRPCProviders.SSXAnkrProvider;
  apiKey?: string;
  network?: SSXAnkrProviderNetworks;
};

/** Type-Guard for SSXAnkrProvider. */
export const isSSXAnkrProvider = (
  provider: SSXRPCProvider
): provider is SSXAnkrProvider =>
  provider.service === SSXRPCProviders.SSXAnkrProvider;

/** Custom provider settings. */
export type SSXCustomProvider = {
  service: SSXRPCProviders.SSXCustomProvider;
  url?: string | ConnectionInfo;
  network?: providers.Networkish;
};

/** Type-Guard for SSXCustomProvider. */
export const isSSXCustomProvider = (
  provider: SSXRPCProvider
): provider is SSXCustomProvider =>
  provider.service === SSXRPCProviders.SSXCustomProvider;

/** Generic provider settings. */
export type SSXGenericProvider = {
  service: SSXRPCProviders;
  url?: string | ConnectionInfo;
  network?: providers.Networkish;
  apiKey?: string | SSXInfuraProviderProjectSettings;
};

/** ENS options supported by SSX. */
export interface SSXEnsResolveOptions {
  /** Enable ENS name/domain resolution. */
  domain?: boolean;
  /** Enable ENS avatar resolution. */
  avatar?: boolean;
}

/** ENS data supported by SSX. */
export interface SSXEnsData {
  /** ENS name/domain. */
  domain?: string | null;
  /** ENS avatar. */
  avatarUrl?: string | null;
}

/** Lens profiles page info */
export interface SSXLensProfilesPageInfo {
  /** Cursor to previous page, e.g. '\{"offset":0\}'. */
  prev: string;
  /** Cursor to next page, e.g. '\{"offset":10\}'. */
  next: string;
  /** Total profiles available to retrieve. */
  totalCount: number;
}

/** Lens profiles item */
export interface SSXLensProfileData {
  id: string;
  name: string | null;
  bio: string | null;
  attributes: Array<any>;
  followNftAddress: string | null;
  metadata: string | null;
  isDefault: boolean;
  picture: string | null;
  handle: string | null;
  coverPicture: string | null;
  ownedBy: string | null;
  dispatcher: any;
  stats: any;
  followModule: any;
}

/** Lens profiles. */
export interface SSXLensProfilesResponse {
  /** Lens profiles array. */
  items: Array<SSXLensProfileData>;
  /** Lens pagination info. */
  pageInfo?: SSXLensProfilesPageInfo;
}

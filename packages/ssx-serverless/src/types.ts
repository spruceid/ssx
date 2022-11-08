import { providers } from 'ethers';
import { ConnectionInfo } from 'ethers/lib/utils';
import { SiweMessage } from 'siwe';

/** Configuration interface for ssx-server */
export interface SSXServerConfig {
  /** Connection to a cryptographic keypair and/or network. */
  providers?: SSXProviders;
  /** Enable lookup for delegations in the DelegateRegistry SC*/
  daoLogin?: boolean;
}

/** SSX web3 configuration settings */
export interface SSXProviders {
  /** JSON RPC provider configurations */
  rpc?: SSXRPCProvider;
  /** Metrics service configurations  */
  metrics?: SSXMetricsProvider;
}

export type SSXRPCProvider =
  | SSXGenericProvider
  | SSXEtherscanProvider
  | SSXInfuraProvider
  | SSXAlchemyProvider
  | SSXCloudflareProvider
  | SSXPocketProvider
  | SSXAnkrProvider
  | SSXCustomProvider;

/** Enum of supported RPC providers */
export enum SSXRPCProviders {
  SSXAlchemyProvider = 'alchemy',
  SSXAnkrProvider = 'ankr',
  SSXCloudflareProvider = 'cloudflare',
  SSXCustomProvider = 'custom',
  SSXEtherscanProvider = 'etherscan',
  SSXInfuraProvider = 'infura',
  SSXPocketProvider = 'pocket',
}

/** Enum of supported networks for Etherscan */
export enum SSXEtherscanProviderNetworks {
  MAINNET = 'homestead',
  ROPSTEN = 'ropsten',
  RINKEBY = 'rinkeby',
  GOERLI = 'goerli',
  KOVAN = 'kovan',
}

/** Etherscan provider settings */
export type SSXEtherscanProvider = {
  service: SSXRPCProviders.SSXEtherscanProvider;
  apiKey?: string;
  network?: SSXEtherscanProviderNetworks;
};

/* Type-Guard for SSXEtherScanProvider */
export const isSSXEtherscanProvider = (provider: SSXRPCProvider):
  provider is SSXEtherscanProvider => provider.service === SSXRPCProviders.SSXEtherscanProvider;

/** Enum of supported networks for Infura */
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

/** Infura provider project settings */
export type SSXInfuraProviderProjectSettings = {
  projectId: string;
  projectSecret: string;
};

/** Infura provider settings */
export type SSXInfuraProvider = {
  service: SSXRPCProviders.SSXInfuraProvider;
  apiKey: string | SSXInfuraProviderProjectSettings;
  network?: SSXInfuraProviderNetworks;
};

/* Type-Guard for SSXInfuraProvider */
export const isSSXInfuraProvider = (provider: SSXRPCProvider):
  provider is SSXInfuraProvider => provider.service === SSXRPCProviders.SSXInfuraProvider;

/** Enum of supported networks for Alchemy */
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

/** Alchemy provider settings */
export type SSXAlchemyProvider = {
  service: SSXRPCProviders.SSXAlchemyProvider;
  apiKey?: string;
  network?: SSXAlchemyProviderNetworks;
};

/* Type-Guard for SSXAlchemyProvider */
export const isSSXAlchemyProvider = (provider: SSXRPCProvider):
  provider is SSXAlchemyProvider => provider.service === SSXRPCProviders.SSXAlchemyProvider;

/** Cloudflare provider settings */
export type SSXCloudflareProvider = {
  service: SSXRPCProviders.SSXCloudflareProvider;
};

/* Type-Guard for SSXCloudflareProvider */
export const isSSXCloudflareProvider = (provider: SSXRPCProvider):
  provider is SSXCloudflareProvider => provider.service === SSXRPCProviders.SSXCloudflareProvider;

/** Enum of supported networks for Pocket */
export enum SSXPocketProviderNetworks {
  MAINNET = 'homestead',
  ROPSTEN = 'ropsten',
  RINKEBY = 'rinkeby',
  GOERLI = 'goerli',
}

/** Pocket provider settings */
export type SSXPocketProvider = {
  service: SSXRPCProviders.SSXPocketProvider;
  apiKey?: string;
  network?: SSXPocketProviderNetworks;
};

/* Type-Guard for SSXPocketProvider */
export const isSSXPocketProvider = (provider: SSXRPCProvider):
  provider is SSXPocketProvider => provider.service === SSXRPCProviders.SSXPocketProvider;

/** Enum of supported networks for Ankr */
export enum SSXAnkrProviderNetworks {
  MAINNET = 'homestead',
  POLYGON = 'matic',
  ARBITRUM = 'arbitrum',
}

/** Ankr provider settings */
export type SSXAnkrProvider = {
  service: SSXRPCProviders.SSXAnkrProvider;
  apiKey?: string;
  network?: SSXAnkrProviderNetworks;
};

/* Type-Guard for SSXAnkrProvider */
export const isSSXAnkrProvider = (provider: SSXRPCProvider):
  provider is SSXAnkrProvider => provider.service === SSXRPCProviders.SSXAnkrProvider;

/** Custom provider settings */
export type SSXCustomProvider = {
  service: SSXRPCProviders.SSXCustomProvider;
  url?: string | ConnectionInfo;
  network?: providers.Networkish;
};

/* Type-Guard for SSXCustomProvider */
export const isSSXCustomProvider = (provider: SSXRPCProvider):
  provider is SSXCustomProvider => provider.service === SSXRPCProviders.SSXCustomProvider;

/** Generic provider settings */
export type SSXGenericProvider = {
  service: SSXRPCProviders;
  url?: string | ConnectionInfo;
  network?: providers.Networkish;
  apiKey?: string | SSXInfuraProviderProjectSettings;
};

/** SSX Metrics Provider settings */
export type SSXMetricsProvider = {
  service: 'ssx';
  apiKey: string;
};

/** Allowed fields for an SSX Log */
export interface SSXLogFields {
  /** Unique identifier for the user, formatted as a DID */
  userId: string;
  /** RFC-3339 time of resource generation, defaults to now */
  timestamp?: string;
  /** Type of content being logged */
  type: SSXEventLogTypes;
  /** Any JSON stringifiable structure to be logged */
  content: string | Record<string, any>;
}

/** Available SSX Log Types */
export enum SSXEventLogTypes {
  /** Login type definition */
  LOGIN = 'ssx-login',
  /** Logout type definition */
  // LOGOUT = "ssx-logout",
  /** Logging type definition */
  // LOG = "LOG",
  /** Event type definition */
  // EVENT = "event",
}

/** 
 * Type definition for CRUD session functions
 * @example
 * ```
 * create: async <T>(value: any, opts?: Record<string, any>): Promise<T> => { },
 * retrieve: async <T>(key: any, opts?: Record<string, any>): Promise<T> => { },
 * update: async <T>(key: any, value: any, opts?: Record<string, any>): Promise<T> => { },
 * delete: async <T>(key: any): Promise<T> => { },
 * ```
 */
export interface SSXSessionCRUDConfig {
  /** Definition of the create function */
  create: <T>(value: any, opts?: Record<string, any>) => Promise<T>,
  /** Definition of the retrieve (search) function */
  retrieve: <T>(key: any, opts?: Record<string, any>) => Promise<T>,
  /** Definition of the update function */
  update: <T>(key: any, value: any, opts?: Record<string, any>) => Promise<T>,
  /** Definition of the delete function */
  delete: <T>(key: any, opts?: Record<string, any>) => Promise<T>
}

export interface SSXEnsData {
  ensName?: string | null,
  ensAvatarUrl?: string | null
}

export interface SSXSessionData {
  siweMessage: SiweMessage,
  signature: string,
  daoLogin: boolean,
  ens: SSXEnsData
}
import { providers } from 'ethers';
import { ConnectionInfo } from 'ethers/lib/utils';
import { CookieOptions } from 'express';
import { SessionOptions, Store } from 'express-session';

/** Configuration interface for ssx-server */
export interface SSXServerConfig {
  /** A key used for signing cookies coming from the server. Providing this key enables signed cookies. */
  signingKey?: string;
  /** Connection to a cryptographic keypair and/or network. */
  providers?: SSXProviders;
  /** Changes cookie attributes. Determines whether or not server cookies
   * require HTTPS and sets the SameSite attribute to 'lax'. Defaults to false */
  useSecureCookies?: boolean;
  /** Configure ENS resolution on signIn. If true, the login function
   *  will return an ens object in session containing the ens data 
   * (if available). */
  ens?: SSXResolveEns;
}

/** ENS resolution settings */
export interface SSXResolveEns {
  /** Enable  ENS name/domain resolution on login */
  resolveEnsDomain: boolean;
  /** Enable  ENS avatar url resolution on login */
  resolveEnsAvatar: boolean;
}

/** SSX web3 configuration settings */
export interface SSXProviders {
  /** JSON RPC provider configurations */
  rpc?: SSXRPCProvider;
  // TODO(w4ll3): doc
  /** */
  sessionConfig?: Partial<SSXSessionStoreConfig>;
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

/** SSX Session Store configuration settings */
export interface SSXSessionStoreConfig {
  /** Overrides for [SessionOptions](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/a24d35afe48f7fb702e7617b983ddca1904ba36b/types/express-session/index.d.ts#L52) */
  sessionOptions?: Partial<SessionOptions>;
  /** Connector for different stores */
  store?: (session) => Store;
}

/** SSX Redis Session Store Provider settings */
export type SSXRedisSessionStoreProvider = {
  service: 'redis';
  redisUrl: string;
};

/** SSX Express Session Store Provider settings */
export type SSXExpressSessionStoreProvider = {
  service: 'express';
  // TODO(w4ll3): add app type and/or change config
  config?: SessionOptions;
};

/** SSX Metrics Provider settings */
export type SSXMetricsProvider = {
  service: 'ssx';
  apiKey: string;
};

/** Configuration interface for cookies issued by ssx-server */
export interface SSXCookieOptions extends CookieOptions {
  /** Prevents client-side javascript from accessing cookies. Should always be true. */
  httpOnly: true;
  /** Whether or not cookies should be sent over https. Recommend true for production. */
  secure: boolean;
  /** Prevents Cross Site Request Forgery Attacks by telling the browser to only send
   * cookies with request from your site. The lax setting allows GET requests from
   * other sites. Recommended true for production. */
  sameSite: boolean | 'lax' | 'strict' | 'none' | undefined;
  /** Whether or not cookies should be signed. Recommended true for production.
   * Set to true by providing a signing key. If false, cookies can be tampered
   * with on the client */
  signed: boolean;
}

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

/** ENS data supported by SSX */
export interface SSXEnsData {
  /** ENS name/domain */
  ensName?: string | null,
  /** ENS avatar */
  ensAvatarUrl?: string | null
}
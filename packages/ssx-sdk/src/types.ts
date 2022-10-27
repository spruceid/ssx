/* eslint-disable no-shadow */
import { ssxSession } from '@spruceid/ssx-sdk-wasm';
import { providers } from 'ethers';
import { ConnectionInfo } from 'ethers/lib/utils';

/** Supported storage types. */
export enum StorageType {
}

/** Core config for SSX. */
export interface SSXConfig {
    /** Whether or not daoLogin is enabled. */
    enableDaoLogin?: boolean;
    /** Connection to a cryptographic keypair and/or network. */
    providers?: SSXProviders;
    /** Optional session configuration for the SIWE message. */
    siweConfig?: SiweConfig;
    storage?: StorageModule;
}

/** Selection and configuration of the storage module. */
export enum StorageModule {
}

/** Representation of an active SSXSession. */
export type SSXSession = {
    address: string;
    walletAddress: string;
    chainId: number;
    sessionKey: string;
    siwe: string;
    signature: string;
};

/** The URL of the server running ssx-server. Providing this field enables SIWE server communication */
export type ServerHost = string;

/** The ssx-powered server configuration settings */
export type SSXProviderServer = {
    host: ServerHost;
};

/** Web3 provider configuration settings */
export interface SSXProviderWeb3 {
    /**
     * window.ethereum for Metamask;
     * web3modal.connect() for Web3Modal;
     * const signer = useSigner(); const provider = signer.provider; from Wagmi for Rainbowkit
     * */
    driver: any;
}

/** SSX web3 configuration settings */
export interface SSXProviders {
    /** Web3 wallet provider */
    web3?: SSXProviderWeb3;
    /** JSON RPC provider configurations */
    rpc?: SSXRPCProvider;
    /** Optional reference to server running ssx-server.
     * Providing this field enables communication with ssx-server
     */
    server?: SSXProviderServer;
}

export type SSXRPCProvider = SSXEtherscanProvider | SSXInfuraProvider | SSXAlchemyProvider | SSXCloudflareProvider | SSXPocketProvider | SSXAnkrProvider | SSXCustomProvider;

/** Enum of supported RPC providers */
export enum SSXRPCProviders {
    SSXEtherscanProvider = 'etherscan',
    SSXInfuraProvider = 'infura',
    SSXAlchemyProvider = 'alchemy',
    SSXCloudflareProvider = 'cloudflare',
    SSXPocketProvider = 'pocket',
    SSXAnkrProvider = 'ankr',
    SSXCustomProvider = 'custom',
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
    apiKey?: string | number;
    network?: SSXEtherscanProviderNetworks;
};

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
    apiKey?: string | number;
    network?: SSXAlchemyProviderNetworks;
};

/** Cloudflare provider settings */
export type SSXCloudflareProvider = {
    service: SSXRPCProviders.SSXCloudflareProvider;
};

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
    apiKey?: string | number;
    network?: SSXPocketProviderNetworks;
};

/** Enum of supported networks for Ankr */
export enum SSXAnkrProviderNetworks {
    MAINNET = 'homestead',
    POLYGON = 'matic',
    ARBITRUM = 'arbitrum',
}

/** Ankr provider settings */
export type SSXAnkrProvider = {
    service: SSXRPCProviders.SSXAnkrProvider;
    apiKey?: string | number;
    network?: SSXAnkrProviderNetworks;
};

/** Custom provider settings */
export type SSXCustomProvider = {
    service: SSXRPCProviders.SSXCustomProvider;
    url?: string | ConnectionInfo;
    network?: providers.Networkish;
};

/** Optional session configuration for the SIWE message. */
export interface SiweConfig extends Partial<ssxSession.SiweConfig> {}

/** A Storage module. */
export interface Storage {
    /** Retrieve a value from storage. */
    get(key: string): Promise<any>,
    /** Insert a key-value pair into storage. */
    put(key: string, value: any): Promise<any>,
    /** List the stored values by key, optionally filtered by prefix. */
    list(prefix?: string): Promise<string[]>,
    /** Delete a value from storage. */
    delete(key: string): Promise<any>,
}

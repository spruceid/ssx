/* eslint-disable no-shadow */
import { ssxSession } from '@spruceid/ssx-sdk-wasm';
import { AxiosInstance } from 'axios';
import { ethers } from 'ethers';
import { SSXEnsData, SSXEnsResolveOptions, SSXRPCProvider } from '../types';

/** Core config for SSX. */
export interface SSXClientConfig {
    /** Whether or not daoLogin is enabled. */
    enableDaoLogin?: boolean;
    /** Connection to a cryptographic keypair and/or network. */
    providers?: SSXClientProviders;
    /** Optional session configuration for the SIWE message. */
    siweConfig?: SiweConfig;
    /** Whether or not ENS resolution is enabled. True means resolve all on client. */
    resolveEns?: boolean | SSXEnsConfig;
}

/** Representation of an active SSXSession. */
export type SSXClientSession = {
    address: string;
    walletAddress: string;
    chainId: number;
    sessionKey: string;
    siwe: string;
    signature: string;
    ens?: SSXEnsData;
};

/** The URL of the server running ssx-server. Providing this field enables SIWE server communication */
export type SSXServerHost = string;

/** The ssx-powered server configuration settings */
export type SSXProviderServer = {
    host: SSXServerHost;
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
export interface SSXClientProviders {
    /** Web3 wallet provider */
    web3?: SSXProviderWeb3;
    /** JSON RPC provider configurations */
    rpc?: SSXRPCProvider;
    /** Optional reference to server running ssx-server.
     * Providing this field enables communication with ssx-server */
    server?: SSXProviderServer;
}


/** Optional session configuration for the SIWE message. */
export interface SiweConfig extends Partial<ssxSession.SiweConfig> { }

/** Extra SIWE fields. */
export type ExtraFields = ssxSession.ExtraFields;

/** Overrides for the session configuration. */
export type ConfigOverrides = {
    siwe?: SiweConfig
};

/** ENS options supported by SSX. */
export interface SSXEnsConfig {
    /** Enable the ENS resolution on server instead of on client. */
    resolveOnServer?: boolean;
    /** ENS resolution options. True means resolve all. */
    resolve: SSXEnsResolveOptions;
}

/** Interface to an intermediate SSX state: connected, but not signed-in. */
export interface ISSXConnected {
    builder: ssxSession.SSXSessionBuilder;
    config: SSXClientConfig;
    extensions: SSXExtension[];
    provider: ethers.providers.Web3Provider;
    afterConnectHooksPromise: Promise<void>;
    isExtensionEnabled: (namespace: string) => boolean;
    api?: AxiosInstance;
    applyExtensions: () => Promise<void>;
    afterSignIn: (session: SSXClientSession) => Promise<void>;
    ssxServerNonce: (params: Record<string, any>) => Promise<string>;
    ssxServerLogin: (session: SSXClientSession) => Promise<any>;
    signIn: () => Promise<SSXClientSession>;
    signOut: (session: SSXClientSession) => Promise<void>
}

/** Interface for an extension to SSX. */
export interface SSXExtension {
    /** [recap] Capability namespace. */
    namespace?: string,
    /** [recap] Default delegated actions in capability namespace. */
    defaultActions?(): Promise<string[]>,
    /** [recap] Delegated actions by target in capability namespace. */
    targetedActions?(): Promise<{ [target: string]: string[] }>,
    /** [recap] Extra metadata to help validate the capability. */
    extraFields?(): Promise<ExtraFields>,
    /** Hook to run after SSX has connected to the user's wallet.
     * This can return an object literal to override the session configuration before the user
     * signs in. */
    afterConnect?(ssx: ISSXConnected): Promise<ConfigOverrides>;
    /** Hook to run after SSX has signed in. */
    afterSignIn?(session: SSXClientSession): Promise<void>,
}

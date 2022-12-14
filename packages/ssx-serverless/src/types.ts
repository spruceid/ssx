import { SiweMessage } from 'siwe';
import { SSXRPCProvider, SSXMetricsProvider, SSXLensProfilesResponse } from '@spruceid/ssx-core';

// TODO: unify with ssx-server
/** Configuration interface for ssx-server */
export interface SSXServerConfig {
  /** Connection to a cryptographic keypair and/or network. */
  providers?: SSXServerProviders;
  /** Enable lookup for delegations in the DelegateRegistry SC*/
  daoLogin?: boolean;
}

/** SSX web3 configuration settings */
export interface SSXServerProviders {
  /** JSON RPC provider configurations */
  rpc?: SSXRPCProvider;
  /** Metrics service configurations  */
  metrics?: SSXMetricsProvider;
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
  create: <T>(value: any, opts?: Record<string, any>) => Promise<T>;
  /** Definition of the retrieve (search) function */
  retrieve: <T>(key: any, opts?: Record<string, any>) => Promise<T>;
  /** Definition of the update function */
  update: <T>(key: any, value: any, opts?: Record<string, any>) => Promise<T>;
  /** Definition of the delete function */
  delete: <T>(key: any, opts?: Record<string, any>) => Promise<T>;
}

export interface SSXEnsData {
  ensName?: string | null;
  ensAvatarUrl?: string | null;
}

export interface SSXSessionData {
  siweMessage: SiweMessage;
  signature: string;
  daoLogin: boolean;
  ens: SSXEnsData;
  lens: string | SSXLensProfilesResponse;
}

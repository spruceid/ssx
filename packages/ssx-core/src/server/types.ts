import { CookieOptions, RequestHandler } from 'express';
import { SessionData, SessionOptions, Store } from 'express-session';
import { SSXEnsData, SSXEnsResolveOptions, SSXRPCProvider } from '../types';
import { EventEmitter } from 'events';
import { ethers } from 'ethers';
import { SiweMessage, SiweError } from 'siwe';

/** Configuration interface for ssx-server */
export interface SSXServerConfig {
  /** A key used for signing cookies coming from the server. Providing this key enables signed cookies. */
  signingKey?: string;
  /** Connection to a cryptographic keypair and/or network. */
  providers?: SSXServerProviders;
  /** Changes cookie attributes. Determines whether or not server cookies
   * require HTTPS and sets the SameSite attribute to 'lax'. Defaults to false */
  useSecureCookies?: boolean;
}

/** SSX web3 configuration settings. */
export interface SSXServerProviders {
  /** JSON RPC provider configurations. */
  rpc?: SSXRPCProvider;
  /** SSX Session Store configuration settings. */
  sessionConfig?: Partial<SSXSessionStoreConfig>;
  /** Metrics service configurations. */
  metrics?: SSXMetricsProvider;
}

/** SSX Session Store configuration settings */
export interface SSXSessionStoreConfig {
  /** Overrides for [SessionOptions](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/a24d35afe48f7fb702e7617b983ddca1904ba36b/types/express-session/index.d.ts#L52) */
  sessionOptions?: Partial<SessionOptions>;
  /** Connector for different stores */
  store?: (session: any) => Store;
}

/** SSX Redis Session Store Provider settings. */
export type SSXRedisSessionStoreProvider = {
  service: 'redis';
  redisUrl: string;
};

/** SSX Express Session Store Provider settings. */
export type SSXExpressSessionStoreProvider = {
  service: 'express';
  config?: SessionOptions;
};

/** SSX Metrics Provider settings. */
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
   * with on the client. */
  signed: boolean;
}

/** Allowed fields for an SSX Log. */
export interface SSXLogFields {
  /** Unique identifier for the user, formatted as a DID. */
  userId: string;
  /** RFC-3339 time of resource generation, defaults to now. */
  timestamp?: string;
  /** Type of content being logged. */
  type: SSXEventLogTypes;
  /** Any JSON stringifiable structure to be logged. */
  content: string | Record<string, any>;
}

/** Available SSX Log Types. */
export enum SSXEventLogTypes {
  /** Login type definition. */
  LOGIN = 'ssx-login',
  /** Logout type definition. */
  // LOGOUT = "ssx-logout",
  /** Logging type definition. */
  // LOG = "LOG",
  /** Event type definition. */
  // EVENT = "event",
}

/**
 * SSX-Server is a server-side library made to work with the SSX client libraries.
 * SSX-Server is the base class that takes in a configuration object and works
 * with various middleware libraries to add authentication and metrics to your server.
 */
export abstract class SSXServerBaseClass extends EventEmitter {
  /** SSXServerConfig object. */
  protected _config;
  /** Axios instance. */
  protected _api;
  /** EthersJS provider. */
  public provider: ethers.providers.BaseProvider;
  /** Session is a configured instance of express-session middleware. */
  public session: RequestHandler;
  /**
   * Sets default values for optional configurations
   */
  protected _setDefaults;
  /**
   * Registers a new event to the API
   * @param data - SSXLogFields object.
   * @returns True (success) or false (fail).
   */
  public log: (data: SSXLogFields) => Promise<boolean>;
  /**
   * Generates a nonce for use in the SSX client libraries.
   * Nonce is a random string that is used to prevent replay attacks.
   * Wraps the generateNonce function from the SIWE library.
   * @returns A nonce string.
   */
  public generateNonce: () => string;
  /**
   * Verifies the SIWE message, signature, and nonce for a sign-in request.
   * If the message is verified, a session token is generated and returned.
   * @param siwe - SIWE Message.
   * @param signature - The signature of the SIWE message.
   * @param daoLogin - Whether or not daoLogin is enabled.
   * @param resolveEns - Resolve ENS settings.
   * @param nonce - nonce string.
   * @returns Request data with SSX Server Session.
   */
  public login: (
    siwe: Partial<SiweMessage> | string,
    signature: string,
    daoLogin: boolean,
    resolveEns: boolean | SSXEnsResolveOptions,
    nonce: string,
    resolveLens?: boolean
  ) => Promise<{
    success: boolean;
    error: SiweError;
    session: Partial<SessionData>;
  }>;
  /**
   * ENS data supported by SSX.
   * @param address - User address.
   * @param resolveEnsOpts - Options to resolve ENS.
   * @returns Object containing ENS data.
   */
  public resolveEns: (
    address: string,
    resolveEnsOpts?: SSXEnsResolveOptions
  ) => Promise<SSXEnsData>;
  /**
   * Logs out the user by deleting the session.
   * Currently this is a no-op.
   * @param destroySession - Method to remove session from storage.
   * @returns Promise with true (success) or false (fail).
   */
  public logout: (destroySession?: () => Promise<any>) => Promise<boolean>;
  /**
   * Gets Express Session config params to configure the session.
   * @returns Session options.
   */
  public getExpressSessionConfig: () => SessionOptions;
  /**
   * Gets default Express Session Config.
   * @returns Default session options
   */
  protected getDefaultExpressSessionConfig;
}
//# sourceMappingURL=server.d.ts.map

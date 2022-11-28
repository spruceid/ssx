import { CookieOptions } from 'express';
import { SessionOptions, Store } from 'express-session';
import { SSXRPCProvider } from '../types';


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
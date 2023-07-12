export * from './ssx';
export * from './modules';
export * from '@spruceid/ssx-core/client';
export * from '@spruceid/ssx-core';
export {
  /** @deprecated use SSXClientConfig field instead */
  SSXClientConfig as SSXConfig,
  /** @deprecated use SSXClientProviders field instead */
  SSXClientProviders as SSXProviders,
  /** @deprecated use SSXClientSession field instead */
  SSXClientSession as SSXSession,
} from '@spruceid/ssx-core/client';
export { SiweMessage } from 'siwe';

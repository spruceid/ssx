export * from './server';
export * from './middlewares';
export * from '@spruceid/ssx-core/dist/types';
export * from '@spruceid/ssx-core/dist/server/types';
export {
  /** @deprecated use SSXServerConfig field instead */
  SSXServerConfig as SSXConfig,
  /** @deprecated use SSXServerProviders field instead */
  SSXServerProviders as SSXProviders,
} from '@spruceid/ssx-core';

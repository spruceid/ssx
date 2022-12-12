# @spruceid/ssx-server

## 1.1.1

### Patch Changes

- b25cbde: Updated `SSXServerRoutes` type to `SSXServerRouteNames` to reflect usage in ssx-server
- Updated dependencies [b25cbde]
- Updated dependencies [b25cbde]
  - @spruceid/ssx-core@1.0.1

## 1.1.0

### Minor Changes

- 83c314c: Enable custom paths for endpoints on client and server.
  This now accepts the routes configuration when instantiating the middlewares as follows:

  ```
  const expressMiddleware = SSXExpressMiddleware(ssx, {
      nonce: '/ssx-custom-nonce',
      login: '/ssx-custom-login',
      logout: '/ssx-custom-logout',
    });

  // or

  const httpMiddleware = SSXHttpMiddleware(ssx, {
      nonce: '/ssx-custom-nonce',
      login: '/ssx-custom-login',
      logout: '/ssx-custom-logout',
    });
  ```

  The second parameter with the configuration object is optional and the default values are: `nonce: '/ssx-nonce'`, `login: '/ssx-login'`, `logout: '/ssx-logout'`. It isn't necessary to override all of them, you can only override one of them.

### Patch Changes

- c989838: Refactor code to avoid duplication and improve performance.

  - Adds `@spruceid/ssx-core` as a dependency;
  - Removes all types and interfaces declarations. They were moved to `ssx-core`;
  - Exports `SSXConfig` (deprecated) and `SSXServerConfig`;
  - Exports `SSXProviders` (deprecated) and `SSXServerProviders`;
  - Removes all utils functions. They were moved to `ssx-core`;
  - Optimizes `try/catch` blocks.

- c66f308: Include and export `SiweMessage` from the `siwe` dependency.
- Updated dependencies [c989838]
- Updated dependencies [83c314c]
  - @spruceid/ssx-core@1.0.0
  - @spruceid/ssx-gnosis-extension@1.0.1

## 1.0.0

### Major Changes

- f317c82: Public release of the SSX SDK

### Minor Changes

- 1072382: Add ENS resolution feature to the client and server to allow the developer to choose where to resolve it.
- Adds `ssx.resolveEns(...)` method to resolve ENS data;
- Express and HTTP middlewares `/ssx-login` responses were updated. These requests were returning a session object with a session property. Now it returns a session object without the session property, but keeping all information;
- Updates `ssx-test-express-api` and `ssx-test-http-api` to show how to use this feature.

### Patch Changes

- Updated dependencies [f317c82]
  - @spruceid/ssx-gnosis-extension@1.0.0

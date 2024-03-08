# @spruceid/ssx-server

## 2.1.0

### Minor Changes

- Dependencies updates, including major bump for webpack-cli/generators, in order to address vulnerabilities including all critical ones.

### Patch Changes

- Updated dependencies
  - @spruceid/ssx-core@2.1.0

## 2.0.0

### Major Changes

- Added stricter checks on nonces
- SSX middleware was moved back to the server package

### Patch Changes

- Updated dependencies
  - @spruceid/ssx-core@2.0.0

## 1.2.4

### Patch Changes

- ce89464: Adds stricter checks on nonces

## 1.2.3

### Patch Changes

- Updated dependencies [94cee9c]
- Updated dependencies [c1f0720]
- Updated dependencies [7f0343b]
- Updated dependencies [ef51b85]
- Updated dependencies [94cee9c]
- Updated dependencies [0274cdf]
  - @spruceid/ssx-core@1.2.0
  - @spruceid/ssx-gnosis-extension@1.1.5
  - @spruceid/ssx-server-middleware@1.1.0

## 1.2.2

### Patch Changes

- Updated dependencies [60dedab]
- Updated dependencies
- Updated dependencies [63f70cf]
  - @spruceid/ssx-gnosis-extension@1.1.4
  - @spruceid/ssx-server-middleware@1.0.2

## 1.2.1

### Patch Changes

- Patch fix for build issue
- Updated dependencies
  - @spruceid/ssx-core@1.1.1
  - @spruceid/ssx-gnosis-extension@1.1.3
  - @spruceid/ssx-server-middleware@1.0.1

## 1.2.0

### Minor Changes

- 24a7220: Adds Lens resolution feature to the server. This feature is available to Polygon Mainnet and Mumbai Testnet (visit [https://docs.lens.xyz/docs/api-links](https://docs.lens.xyz/docs/api-links) for more information).

  - Adds `ssx.resolveLens(...)` method to resolve Lens profiles;
  - Updates `ssx.login()` to accept `resolveLens?: boolean` as parameter and returns Lens profiles if `true`. This property isn't mandatory and the value is `false`;
  - Express and HTTP middlewares `/ssx-login` returns Lens profiles if requested;

### Patch Changes

- 836ed67: Improved promise resolution to the verification of the Siwe Message, preventing potential exceptions coming from the middleware.
- 6205fc4: Extracted middleware logic to new ssx-server-middleware package. Moved `SSXServer` class interface to `ssx-core` and passed around implementation
- Updated dependencies [6205fc4]
- Updated dependencies [6205fc4]
- Updated dependencies [24a7220]
  - @spruceid/ssx-core@1.1.0
  - @spruceid/ssx-server-middleware@1.0.0
  - @spruceid/ssx-gnosis-extension@1.1.2

## 1.1.1

### Patch Changes

- b25cbde: Updated `SSXServerRoutes` type to `SSXServerRouteNames` to reflect usage in ssx-server
- Updated dependencies [b25cbde]
  - @spruceid/ssx-core@1.0.1
  - @spruceid/ssx-gnosis-extension@1.1.1

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

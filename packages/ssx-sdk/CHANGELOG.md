# @spruceid/ssx

## 2.2.0

### Minor Changes

- Dependencies updates, including major bump for webpack-cli/generators, in order to address vulnerabilities including all critical ones.

### Patch Changes

- Updated dependencies
  - @spruceid/ssx-core@2.1.0

## 2.1.0

### Minor Changes

- c942c3c: This adds the Credentials Modules, which allows developers to fetch credentials issued on SpruceKit Credential Issuer.
  This module requires Storage Module, so you must enable both to make it work.

  ```ts
  const ssx = SSX({
    modules: {
      storage: true,
      credentials: true,
    },
  });

  await ssx.signIn();

  const { data } = ssx.credentials.list();
  ```

## 2.0.1

### Patch Changes

- ad0311d: Updates the way the default options are included in the KeplerStorage module

## 2.0.0

### Major Changes

- ## Major rework of the library architecture

  SSX is now composed of modules that add significant functionality improvements. The previous functions of SSX were moved into a new module called [UserAuthorization](https://www.sprucekit.dev/ssx/installing-ssx/userauthorization-module) and will, from now on, be responsible for end-user signing-related operations.

  A new module was added, [Storage](https://www.sprucekit.dev/ssx/installing-ssx/storage-module), which provides functionality to store and retrieve data in [Kepler](https://github.com/spruceid/kepler). Kepler is architected as a decentralized storage system that uses DIDs and Authorization Capabilities to define where your data lives and who has access.

  ## Improved tests

  To keep improving the library, additional tests were added.

  ## Updated dependencies

  Updated several libraries to address deprecation issues and possible vulnerabilities.

  **⚠** You can [check here](https://www.sprucekit.dev/ssx/ssx-overview) for the latest documentation. **⚠**

### Patch Changes

- Updated dependencies
  - @spruceid/ssx-core@2.0.0

## 1.2.5

### Patch Changes

- Updated dependencies [94cee9c]
- Updated dependencies [c1f0720]
- Updated dependencies [7f0343b]
- Updated dependencies [ef51b85]
- Updated dependencies [0274cdf]
  - @spruceid/ssx-core@1.2.0
  - @spruceid/ssx-gnosis-extension@1.1.5

## 1.2.4

### Patch Changes

- Bump version for package rebuild

## 1.2.3

### Patch Changes

- aa228bc: Separated and exposed the connect function to connect the SSX instance to the ethereum provider. Also exposed the extension interface to allow for extensions to SSX

## 1.2.2

### Patch Changes

- Updated dependencies [60dedab]
- Updated dependencies [63f70cf]
  - @spruceid/ssx-gnosis-extension@1.1.4

## 1.2.1

### Patch Changes

- Patch fix for build issue
- Updated dependencies
  - @spruceid/ssx-core@1.1.1
  - @spruceid/ssx-gnosis-extension@1.1.3

## 1.2.0

### Minor Changes

- 6205fc4: Added support for customAPIOperations in the SSX server configuration. This allows for configurations that execute a function instead of making a request to the configured endpoint for any of the ssx endpoints (nonce, login, logout).
- d74757d: Updates the nonce request params to send the walletAddress. This change is required for early detection of a multisig login.
- 24a7220: Adds Lens resolution feature to the client. This feature is available to Polygon Mainnet and Mumbai Testnet (visit [https://docs.lens.xyz/docs/api-links](https://docs.lens.xyz/docs/api-links) for more information).

  - Adds Lens resolution configuration (`resolveLens: true | false | 'onServer'`) when creating a new `SSX` instance. This property isn't mandatory and the default value is `false`;
  - Updates `ssx.signIn()` to resolve Lens data according to the `SSX` config. This method now sends `resolveLens` param to the `/ssx-login` request;
  - Adds `ssx.resolveLens(...)` method to resolve Lens profiles on client;
  - Updates `ssx-test-dapp` to show how to use this feature.

### Patch Changes

- Updated dependencies [6205fc4]
- Updated dependencies [6205fc4]
- Updated dependencies [24a7220]
  - @spruceid/ssx-core@1.1.0
  - @spruceid/ssx-gnosis-extension@1.1.2

## 1.1.1

### Patch Changes

- b25cbde: Update the `SSXServerRoutes` type to accept a route configuration compatible with [Axios Request Config](SSXServerRoutes) to allow for more complex server configurations.
- Updated dependencies [b25cbde]
  - @spruceid/ssx-core@1.0.1
  - @spruceid/ssx-gnosis-extension@1.1.1

## 1.1.0

### Minor Changes

- 83c314c: Enable custom paths for endpoints on client and server.
  Due to the change in `SSXClientConfig`, it now accepts the server's routes configuration:

  ```
  const ssx = new SSX({
    providers: {
      server: {
          host: 'http://localhost:3001',
          routes: {
              nonce: '/ssx-custom-nonce',
              login: '/ssx-custom-login',
              logout: '/ssx-custom-logout',
          }
      }
    }
  });
  ```

  This is an optional configuration and the default values are: `nonce: '/ssx-nonce'`, `login: '/ssx-login'`, `logout: '/ssx-logout'`. It isn't necessary to override all of them, you can only override one of them.

### Patch Changes

- c989838: Refactor code to avoid duplication and improve performance.
  - Adds `@spruceid/ssx-core` as a dependency;
  - Removes all types and interfaces declarations. They were moved to `ssx-core`;
  - Exports `SSXConfig` (deprecated) and `SSXClientConfig`;
  - Exports `SSXProviders` (deprecated) and `SSXClientProviders`;
  - Exports `SSXSession` (deprecated) and `SSXClientSession`;
  - Removes all utils functions. They were moved to `ssx-core`;
  - Optimizes `try/catch` blocks;
  - Updates `examples/ssx-test-dapp` to support ENS resolution from `examples/ssx-test-serverless-dynamodb-api`.
- c66f308: Include and export `SiweMessage` from the `siwe` dependency.
- Updated dependencies [c989838]
- Updated dependencies [83c314c]
  - @spruceid/ssx-core@1.0.0
  - @spruceid/ssx-gnosis-extension@1.1.0

## 1.0.0

### Major Changes

- f317c82: Public release of the SSX SDK

### Minor Changes

- a91af88: Throws an error in case an API is configured but no nonce is returned from it.
- 1072382: Add ENS resolution feature to the client and server to allow the developer to choose where to resolve it.
- Adds ENS resolution configuration when creating a new `SSX` instance. This configuration isn't mandatory;
- Updates `SSXSession` interface to add `ens: SSXEnsData` as optional property;
- Updates `ssx.signIn()` to resolve ENS data according to the `SSX` config. This method now sends `resolveEns` param to the `/ssx-login` request;
- Adds `ssx.resolveEns(...)` method to resolve ENS data on client;
- The internal SSX session object is now public and accessible by `ssx.session`;
- Updates `ssx-test-dapp` to show how to use this feature.

### Patch Changes

- Updated dependencies [f317c82]
  - @spruceid/ssx-gnosis-extension@1.0.0

## 0.1.1

### Patch Changes

- a44f78c: Detect wallet connection and prevent connect attempt if already connected
- 0f84d97: Detect if a web3 provider is being provided instead of always instantiating a new Web3Provider.

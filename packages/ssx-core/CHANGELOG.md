# @spruceid/ssx-core

## 2.0.0

### Major Changes

- c989838: Refactor code to avoid duplication and improve performance.

  ## General changes:

  - Creates a main `tsconfig` file to be extended by packages;
  - Configures `ssx-core`as a new package on the monorepo;
  - Removes duplicate `@changesets/cli` dependency.

  ## @spruceid/ssx-core creation:

  - This package was created to held the types definitions and utils functions to all packages. This reduces the amount of duplicated code, prevent circular dependencies, reduces package sizes (tree-shaking during transpilation), and ensures that changes to the API will need a bump to this new package.
  - To unify the packages some interfaces/types names were updated:
    - `@spruceid/ssx-sdk`: `SSXConfig` -> `SSXClientConfig`;
    - `@spruceid/ssx-sdk`: `SSXProviders` -> `SSXClientProviders`;
    - `@spruceid/ssx-sdk`: `SSXSession` -> `SSXClientSession`;
    - `@spruceid/ssx-server`: `SSXConfig` -> `SSXServerConfig`;
    - `@spruceid/ssx-server`: `SSXProviders` -> `SSXServerProviders`;

  ## @spruceid/ssx changes:

  - Adds `@spruceid/ssx-core` as a dependency;
  - Removes all types and interfaces declarations. They were moved to `ssx-core`;
  - Exports `SSXConfig` (deprecated) and `SSXClientConfig`;
  - Exports `SSXProviders` (deprecated) and `SSXClientProviders`;
  - Exports `SSXSession` (deprecated) and `SSXClientSession`;
  - Removes all utils functions. They were moved to `ssx-core`;
  - Optimizes `try/catch` blocks;
  - Updates `examples/ssx-test-dapp` to support ENS resolution from `examples/ssx-test-serverless-dynamodb-api`.

  ## @spruceid/ssx-react changes:

  - Updates `ssxConfig?: SSXConfig;` on `SSXProviderProps` to `ssxConfig?: SSXClientConfig;` (non breaking change).

  ## @spruceid/ssx-gnosis-extension changes:

  - Adds `@spruceid/ssx-core` as a dependency;
  - Adds types from `ssx-core` to all SSX related variables;
  - Optimizes `try/catch` blocks.

  ## @spruceid/ssx-server changes:

  - Adds `@spruceid/ssx-core` as a dependency;
  - Removes all types and interfaces declarations. They were moved to `ssx-core`;
  - Exports `SSXConfig` (deprecated) and `SSXServerConfig`;
  - Exports `SSXProviders` (deprecated) and `SSXServerProviders`;
  - Removes all utils functions. They were moved to `ssx-core`;
  - Optimizes `try/catch` blocks.

  ## @spruceid/ssx-serverless changes:

  - Adds `@spruceid/ssx-core` as a dependency;
  - Removes some types and interfaces declarations. They were moved to `ssx-core`;
  - Removes all utils functions. They were moved to `ssx-core`;
  - Optimizes `try/catch` blocks;
  - Changes axios version to `"^0.27.2"`;
  - Updates `examples/ssx-test-serverless-dynamodb-api` to resolve ENS accorddly with the request params and fixes the `/ssx-login` JSON response.

### Minor Changes

- 83c314c: Enable custom paths for endpoints on client and server.

  ## @spruceid/ssx-core changes:

  - Creates and exports `SSXServerRoutes` interface
  - Adds `routes?: SSXServerRoutes` to `SSXClientConfig.providers.server`.

  ## @spruceid/ssx changes:

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

  ## @spruceid/ssx-server changes:

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

# @spruceid/ssx-gnosis-extension

## 1.0.1

### Patch Changes

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

- Updated dependencies [c989838]
- Updated dependencies [83c314c]
  - @spruceid/ssx-core@2.0.0

## 1.0.0

### Major Changes

- f317c82: Public release of the SSX SDK

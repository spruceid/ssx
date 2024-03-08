# @spruceid/ssx-core

## 2.1.0

### Minor Changes

- Dependencies updates, including major bump for webpack-cli/generators, in order to address vulnerabilities including all critical ones.

## 2.0.0

### Major Changes

- Added new types to support the new structure
- The package `@spruceid/ssx-gnosis-extension` had its code moved to this library.

## 1.2.0

### Minor Changes

- 94cee9c: This updates the `SSXServerRoutes` type to enable callbacks on ssx server middlewares routes.

### Patch Changes

- 7f0343b: Ensures users on a different network with `resolveEns` set to true don't experience sign-in failures.

## 1.1.1

### Patch Changes

- Patch fix for build issue

## 1.1.0

### Minor Changes

- 6205fc4: Added support for customAPIOperations in the SSX server configuration. This allows for configurations that execute a function instead of making a request to the configured endpoint for any of the ssx endpoints (nonce, login, logout).
- 24a7220: Adds Lens resolution feature to the client and server to allow the developer to choose where to resolve it. This feature is available to Polygon Mainnet and Mumbai Testnet (visit [https://docs.lens.xyz/docs/api-links](https://docs.lens.xyz/docs/api-links) for more information).

  - Creates and exports `SSXLensProfilesPageInfo`, `SSXLensProfileData`, and `SSXLensProfilesResponse` interfaces;
  - Adds `resolveLens?: boolean | 'onServer'` property on `SSXClientConfig` interface;
  - Adds `lens?: string | SSXLensProfilesResponse` property on `SSXClientSession` interface;
  - Updates `ssxResolveEns` docstring;
  - Creates and exports `ssxResolveLens` method to resolve Lens profiles;
  - Adds tests to the Lens profiles resolution feature.

### Patch Changes

- 6205fc4: Extracted middleware logic to new ssx-server-middleware package. Moved `SSXServer` class interface to `ssx-core` and passed around implementation

## 1.0.1

### Patch Changes

- b25cbde: Updated `SSXServerRoutes` type to `SSXServerRouteNames` to reflect usage in ssx-server
- b25cbde: Update the `SSXServerRoutes` type to accept a route configuration compatible with [Axios Request Config](SSXServerRoutes) to allow for more complex server configurations.

## 1.0.0

Initial Release

### Major Changes

- c989838: Refactor code to avoid duplication and improve performance.
  - This package was created to held the types definitions and utils functions to all packages. This reduces the amount of duplicated code, prevent circular dependencies, reduces package sizes (tree-shaking during transpilation), and ensures that changes to the API will need a bump to this new package.
  - To unify the packages some interfaces/types names were updated:
    - `@spruceid/ssx-sdk`: `SSXConfig` -> `SSXClientConfig`;
    - `@spruceid/ssx-sdk`: `SSXProviders` -> `SSXClientProviders`;
    - `@spruceid/ssx-sdk`: `SSXSession` -> `SSXClientSession`;
    - `@spruceid/ssx-server`: `SSXConfig` -> `SSXServerConfig`;
    - `@spruceid/ssx-server`: `SSXProviders` -> `SSXServerProviders`;

### Minor Changes

- 83c314c: Enable custom paths for endpoints on client and server.
  - Creates and exports `SSXServerRoutes` interface
  - Adds `routes?: SSXServerRoutes` to `SSXClientConfig.providers.server`.

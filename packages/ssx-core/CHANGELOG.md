# @spruceid/ssx-core

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

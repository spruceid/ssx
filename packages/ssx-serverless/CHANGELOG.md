# @spruceid/ssx-serverless

## 1.1.0

### Minor Changes

- c989838: Refactor code to avoid duplication and improve performance.
  - Adds `@spruceid/ssx-core` as a dependency;
  - Removes some types and interfaces declarations. They were moved to `ssx-core`;
  - Removes all utils functions. They were moved to `ssx-core`;
  - Optimizes `try/catch` blocks;
  - Changes axios version to `"^0.27.2"`;
  - Updates `examples/ssx-test-serverless-dynamodb-api` to resolve ENS according to the request params and fixes the `/ssx-login` JSON response.

- Updated dependencies [c989838]
- Updated dependencies [83c314c]
  - @spruceid/ssx-core@1.0.0
  - @spruceid/ssx-gnosis-extension@1.1.0

## 1.0.0

### Major Changes

- f317c82: Public release of the SSX SDK

### Patch Changes

- 1072382: Add ENS resolution feature to the client and server to allow the developer to choose where to resolve it.
- Updates the ENS resolution to only return defined properties.

- Updated dependencies [f317c82]
  - @spruceid/ssx-gnosis-extension@1.0.0

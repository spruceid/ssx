# @spruceid/ssx-server

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

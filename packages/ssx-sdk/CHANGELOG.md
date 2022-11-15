# @spruceid/ssx

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

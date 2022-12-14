---
'@spruceid/ssx-core': minor
'@spruceid/ssx': minor
'@spruceid/ssx-server': minor
'@spruceid/ssx-serverless': minor
---

Adds Lens resolution feature to the client and server to allow the developer to choose where to resolve it. This feature is available to Polygon Mainnet and Mumbai Testnet (visit (https://docs.lens.xyz/docs/api-links)[https://docs.lens.xyz/docs/api-links] for more information). 

## @spruceid/ssx-core changes:
- Creates and exports `SSXLensProfilesPageInfo`, `SSXLensProfileData`, and `SSXLensProfilesResponse` interfaces;
- Adds `resolveLens?: boolean | 'onServer'` property on `SSXClientConfig` interface;
- Adds `lens?: string | SSXLensProfilesResponse` property on `SSXClientSession` interface;
- Updates `ssxResolveEns` docstring;
- Creates and exports `ssxResolveLens` method to resolve Lens profiles;
- Adds tests to the Lens profiles resolution feature.

## @spruceid/ssx changes: 
- Adds Lens resolution configuration (`resolveLens: true | false | 'onServer'`) when creating a new `SSX` instance. This property isn't mandatory and the default value is `false`;
- Updates `ssx.signIn()` to resolve Lens data according to the `SSX` config. This method now sends `resolveLens` param to the `/ssx-login` request;
- Adds `ssx.resolveLens(...)` method to resolve Lens profiles on client;
- Updates `ssx-test-dapp` to show how to use this feature.

## @spruceid/ssx-server changes: 
- Adds `ssx.resolveLens(...)` method to resolve Lens profiles;
- Updates `ssx.login()` to accept `resolveLens?: boolean` as parameter and returns Lens profiles if `true`. This property isn't mandatory and the value is `false`;
- Express and HTTP middlewares `/ssx-login` returns Lens profiles if requested;

## @spruceid/ssx-serverless changes: 
- Adds `ssx.resolveLens(...)` method to resolve Lens profiles;
- Updates `ssx.signIn()` to accept `resolveLens?: boolean` as parameter and returns Lens profiles if `true`. This property isn't mandatory and the value is `false`;

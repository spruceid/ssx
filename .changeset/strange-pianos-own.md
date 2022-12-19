---
'@spruceid/ssx-core': minor
---

Adds Lens resolution feature to the client and server to allow the developer to choose where to resolve it. This feature is available to Polygon Mainnet and Mumbai Testnet (visit (https://docs.lens.xyz/docs/api-links)[https://docs.lens.xyz/docs/api-links] for more information). 

## @spruceid/ssx-core changes:
- Creates and exports `SSXLensProfilesPageInfo`, `SSXLensProfileData`, and `SSXLensProfilesResponse` interfaces;
- Adds `resolveLens?: boolean | 'onServer'` property on `SSXClientConfig` interface;
- Adds `lens?: string | SSXLensProfilesResponse` property on `SSXClientSession` interface;
- Updates `ssxResolveEns` docstring;
- Creates and exports `ssxResolveLens` method to resolve Lens profiles;
- Adds tests to the Lens profiles resolution feature.
---
'@spruceid/ssx-serverless': patch
---

Adds Lens resolution feature to the server. This feature is available to Polygon Mainnet and Mumbai Testnet (visit (https://docs.lens.xyz/docs/api-links)[https://docs.lens.xyz/docs/api-links] for more information). 

- Adds `ssx.resolveLens(...)` method to resolve Lens profiles;
- Updates `ssx.signIn()` to accept `resolveLens?: boolean` as parameter and returns Lens profiles if `true`. This property isn't mandatory and the value is `false`;
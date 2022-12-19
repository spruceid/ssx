---
'@spruceid/ssx': patch
---

Adds Lens resolution feature to the client. This feature is available to Polygon Mainnet and Mumbai Testnet (visit (https://docs.lens.xyz/docs/api-links)[https://docs.lens.xyz/docs/api-links] for more information). 

- Adds Lens resolution configuration (`resolveLens: true | false | 'onServer'`) when creating a new `SSX` instance. This property isn't mandatory and the default value is `false`;
- Updates `ssx.signIn()` to resolve Lens data according to the `SSX` config. This method now sends `resolveLens` param to the `/ssx-login` request;
- Adds `ssx.resolveLens(...)` method to resolve Lens profiles on client;
- Updates `ssx-test-dapp` to show how to use this feature.

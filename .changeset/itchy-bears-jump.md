---
"@spruceid/ssx": minor
"@spruceid/ssx-server": minor
"@spruceid/ssx-serverless": patch
---

Add ENS resolution feature to the client and server to allow the developer to choose where to resolve it.

## @spruceid/ssx changes: 
- Adds ENS resolution configuration when creating a new `SSX` instance. This configuration isn't mandatory;
- Updates `SSXSession` interface to add `ens: SSXEnsData` as optional property;
- Updates `ssx.signIn()` to resolve ENS data according to the `SSX` config. This method now sends `resolveEns` param to the `/ssx-login` request;
- Adds `ssx.resolveEns(...)` method to resolve ENS data on client;
- The internal SSX session object is now public and accessible by `ssx.session`;
- Updates `ssx-test-dapp` to show how to use this feature.

## @spruceid/ssx-server changes: 
- Adds `ssx.resolveEns(...)` method to resolve ENS data;
- Express and HTTP middlewares `/ssx-login` responses were updated. These requests were returning a session object with a session property. Now it returns a session object without the session property, but keeping all information;
- Updates `ssx-test-express-api` and `ssx-test-http-api` to show how to use this feature.

## @spruceid/ssx-serverless changes: 
- Updates the ENS resolution to only return defined properties.


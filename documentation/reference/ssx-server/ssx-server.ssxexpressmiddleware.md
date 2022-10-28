# ssxexpressmiddleware

[Home](https://github.com/spruceid/ssx/blob/main/documentation/reference/ssx-server/index.md) > [@spruceid/ssx-server](./) > [SSXExpressMiddleware](ssx-server.ssxexpressmiddleware.md)

### SSXExpressMiddleware variable

This middleware function has two key functions: 1. It provides 3 endpoints for the client to hit: /ssx-nonce, /ssx-login, and /ssx-logout. These endpoints are used to authenticate the SIWE message and issue sessions. 2. It provides a middleware function that can be used to authenticate session. The middleware then exposes the authenticated session's data via the `req.ssx` property.

**Signature:**

```typescript
SSXExpressMiddleware: (ssx: SSXServer) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>[]
```

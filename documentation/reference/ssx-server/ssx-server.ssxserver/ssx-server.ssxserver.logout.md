# logout

[Home](https://github.com/spruceid/ssx/blob/main/documentation/reference/ssx-server/index.md) > [@spruceid/ssx-server](../) > [SSXServer](./) > [logout](ssx-server.ssxserver.logout.md)

### SSXServer.logout property

Logs out the user by deleting the session. Currently this is a no-op.

**Signature:**

```typescript
logout: (destroySession?: () => Promise<any>) => Promise<boolean>;
```

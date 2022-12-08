# logout

[Home](index.md) > [@spruceid/ssx-server](ssx-server.md) > [SSXServer](ssx-server.ssxserver.md) > [logout](ssx-server.ssxserver.logout.md)

### SSXServer.logout property

Logs out the user by deleting the session. Currently this is a no-op.

**Signature:**

```typescript
logout: (destroySession?: () => Promise<any>) => Promise<boolean>;
```

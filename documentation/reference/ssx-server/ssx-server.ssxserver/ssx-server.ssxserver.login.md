# login

[Home](https://github.com/spruceid/ssx/blob/main/documentation/reference/ssx-server/index.md) > [@spruceid/ssx-server](../) > [SSXServer](./) > [login](ssx-server.ssxserver.login.md)

### SSXServer.login property

Verifies the SIWE message, signature, and nonce for a sign-in request. If the message is verified, a session token is generated and returned.

**Signature:**

```typescript
login: (siwe: SiweMessage | string, signature: string, daoLogin: boolean, nonce: string) => Promise<{
        success: boolean;
        error: SiweError;
        session: Partial<SessionData>;
    }>;
```

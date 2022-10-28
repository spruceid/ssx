# signin

[Home](https://github.com/spruceid/ssx/blob/main/documentation/reference/ssx-sdk/index.md) > [@spruceid/ssx](../) > [SSXConnected](./) > [signIn](ssx.ssxconnected.signin.md)

### SSXConnected.signIn() method

Requests the user to sign in.

Generates the SIWE message for this session, requests the configured Signer to sign the message, calls the "afterSignIn" methods of the extensions and returns the SSXSession object.

**Signature:**

```typescript
signIn(): Promise<SSXSession>;
```

**Returns:**

Promise<[SSXSession](../ssx.ssxsession.md)>

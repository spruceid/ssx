# ssxconnected

[Home](https://github.com/spruceid/ssx/blob/main/documentation/reference/ssx-sdk/index.md) > [@spruceid/ssx](../) > [SSXConnected](./)

### SSXConnected class

An intermediate SSX state: connected, but not signed-in.

**Signature:**

```typescript
export declare class SSXConnected 
```

### Constructors

| Constructor                                                                                 | Modifiers | Description                                           |
| ------------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------- |
| [(constructor)(builder, config, extensions, provider)](ssx.ssxconnected.\_constructor\_.md) |           | Constructs a new instance of the `SSXConnected` class |

### Properties

| Property                                                                 | Modifiers | Type                                    | Description                                                                                                    |
| ------------------------------------------------------------------------ | --------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [afterConnectHooksPromise](ssx.ssxconnected.afterconnecthookspromise.md) |           | Promise\<void>                          | Promise that is initialized on construction of this class to run the "afterConnect" methods of the extensions. |
| [api?](ssx.ssxconnected.api.md)                                          |           | AxiosInstance                           | _(Optional)_                                                                                                   |
| [builder](ssx.ssxconnected.builder.md)                                   |           | ssxSession.SSXSessionBuilder            |                                                                                                                |
| [config](ssx.ssxconnected.config.md)                                     |           | [SSXConfig](../ssx.ssxconfig/)          |                                                                                                                |
| [extensions](ssx.ssxconnected.extensions.md)                             |           | [SSXExtension](../ssx.ssxextension/)\[] |                                                                                                                |
| [isExtensionEnabled](ssx.ssxconnected.isextensionenabled.md)             |           | (namespace: string) => boolean          |                                                                                                                |
| [provider](ssx.ssxconnected.provider.md)                                 |           | ethers.providers.Web3Provider           |                                                                                                                |

### Methods

| Method                                                        | Modifiers | Description                                                                                                                                                                                                                      |
| ------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [afterSignIn(session)](ssx.ssxconnected.aftersignin.md)       |           | Applies the "afterSignIn" methods of the extensions.                                                                                                                                                                             |
| [applyExtensions()](ssx.ssxconnected.applyextensions.md)      |           | Applies the "afterConnect" methods and the delegated capabilities of the extensions.                                                                                                                                             |
| [signIn()](ssx.ssxconnected.signin.md)                        |           | <p>Requests the user to sign in.</p><p>Generates the SIWE message for this session, requests the configured Signer to sign the message, calls the "afterSignIn" methods of the extensions and returns the SSXSession object.</p> |
| [signOut()](ssx.ssxconnected.signout.md)                      |           |                                                                                                                                                                                                                                  |
| [ssxServerLogin(session)](ssx.ssxconnected.ssxserverlogin.md) |           |                                                                                                                                                                                                                                  |
| [ssxServerNonce()](ssx.ssxconnected.ssxservernonce.md)        |           |                                                                                                                                                                                                                                  |

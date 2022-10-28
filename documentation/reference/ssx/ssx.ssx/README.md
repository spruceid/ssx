# ssx

[Home](https://github.com/spruceid/ssx/blob/main/documentation/reference/ssx-sdk/index.md) > [@spruceid/ssx](../) > [SSX](./)

### SSX class

SSX: Self-sovereign anything.

A toolbox for user-controlled identity, credentials, storage and more.

**Signature:**

```typescript
export declare class SSX 
```

### Constructors

| Constructor                                         | Modifiers | Description                                  |
| --------------------------------------------------- | --------- | -------------------------------------------- |
| [(constructor)(config)](ssx.ssx.\_constructor\_.md) |           | Constructs a new instance of the `SSX` class |

### Properties

| Property                                | Modifiers | Type                                                | Description                                                     |
| --------------------------------------- | --------- | --------------------------------------------------- | --------------------------------------------------------------- |
| [address](ssx.ssx.address.md)           |           | () => string \| undefined                           | Get the address that is connected and signed in.                |
| [chainId](ssx.ssx.chainid.md)           |           | () => number \| undefined                           | Get the chainId that the address is connected and signed in on. |
| [connection?](ssx.ssx.connection.md)    |           | [SSXConnected](../ssx.ssxconnected/)                | _(Optional)_ Current connection of SSX                          |
| [RPCProviders](ssx.ssx.rpcproviders.md) | `static`  | typeof [SSXRPCProviders](../ssx.ssxrpcproviders.md) | Supported RPC Providers                                         |

### Methods

| Method                          | Modifiers | Description                                         |
| ------------------------------- | --------- | --------------------------------------------------- |
| [signIn()](ssx.ssx.signin.md)   |           | Request the user to sign in, and start the session. |
| [signOut()](ssx.ssx.signout.md) |           |                                                     |

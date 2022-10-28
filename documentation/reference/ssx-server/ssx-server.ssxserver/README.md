# ssxserver

[Home](https://github.com/spruceid/ssx/blob/main/documentation/reference/ssx-server/index.md) > [@spruceid/ssx-server](../) > [SSXServer](./)

### SSXServer class

SSX-Server is a server-side library made to work with the SSX client libraries. SSX-Server is the base class that takes in a configuration object and works with various middleware libraries to add authentication and metrics to your server.

**Signature:**

```typescript
export declare class SSXServer 
```

### Constructors

| Constructor                                                      | Modifiers | Description                                        |
| ---------------------------------------------------------------- | --------- | -------------------------------------------------- |
| [(constructor)(config)](ssx-server.ssxserver.\_constructor\_.md) |           | Constructs a new instance of the `SSXServer` class |

### Properties

| Property                                                                   | Modifiers | Type                                                                                                                                                                   | Description                                                                                                                                                                     |
| -------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [generateNonce](ssx-server.ssxserver.generatenonce.md)                     |           | () => string                                                                                                                                                           | Generates a nonce for use in the SSX client libraries. Nonce is a random string that is used to prevent replay attacks. Wraps the generateNonce function from the SIWE library. |
| [getExpressSessionConfig](ssx-server.ssxserver.getexpresssessionconfig.md) |           | () => SessionOptions                                                                                                                                                   |                                                                                                                                                                                 |
| [log](ssx-server.ssxserver.log.md)                                         |           | (data: [SSXLogFields](../ssx-server.ssxlogfields/)) => Promise\<boolean>                                                                                               | Registers a new event to the API                                                                                                                                                |
| [login](ssx-server.ssxserver.login.md)                                     |           | (siwe: SiweMessage \| string, signature: string, daoLogin: boolean, nonce: string) => Promise<{ success: boolean; error: SiweError; session: Partial\<SessionData>; }> | Verifies the SIWE message, signature, and nonce for a sign-in request. If the message is verified, a session token is generated and returned.                                   |
| [logout](ssx-server.ssxserver.logout.md)                                   |           | (destroySession?: () => Promise\<any>) => Promise\<boolean>                                                                                                            | Logs out the user by deleting the session. Currently this is a no-op.                                                                                                           |
| [provider](ssx-server.ssxserver.provider.md)                               |           | ethers.providers.Provider                                                                                                                                              |                                                                                                                                                                                 |
| [session](ssx-server.ssxserver.session.md)                                 |           | RequestHandler                                                                                                                                                         | session is a configured instance of express-session middleware                                                                                                                  |

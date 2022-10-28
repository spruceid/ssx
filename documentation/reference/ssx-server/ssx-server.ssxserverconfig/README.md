# ssxserverconfig

[Home](https://github.com/spruceid/ssx/blob/main/documentation/reference/ssx-server/index.md) > [@spruceid/ssx-server](../) > [SSXServerConfig](./)

### SSXServerConfig interface

Configuration interface for ssx-server

**Signature:**

```typescript
export interface SSXServerConfig 
```

### Properties

| Property                                                            | Modifiers | Type                                        | Description                                                                                                                                                |
| ------------------------------------------------------------------- | --------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [providers?](ssx-server.ssxserverconfig.providers.md)               |           | [SSXProviders](../ssx-server.ssxproviders/) | _(Optional)_ Connection to a cryptographic keypair and/or network.                                                                                         |
| [signingKey?](ssx-server.ssxserverconfig.signingkey.md)             |           | string                                      | _(Optional)_ A key used for signing cookies coming from the server. Providing this key enables signed cookies.                                             |
| [useSecureCookies?](ssx-server.ssxserverconfig.usesecurecookies.md) |           | boolean                                     | _(Optional)_ Changes cookie attributes. Determines whether or not server cookies require HTTPS and sets the SameSite attribute to 'lax'. Defaults to false |

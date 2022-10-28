# ssxconfig

[Home](https://github.com/spruceid/ssx/blob/main/documentation/reference/ssx-sdk/index.md) > [@spruceid/ssx](../) > [SSXConfig](./)

### SSXConfig interface

Core config for SSX.

**Signature:**

```typescript
export declare interface SSXConfig 
```

### Properties

| Property                                           | Modifiers | Type                                     | Description                                                        |
| -------------------------------------------------- | --------- | ---------------------------------------- | ------------------------------------------------------------------ |
| [enableDaoLogin?](ssx.ssxconfig.enabledaologin.md) |           | boolean                                  | _(Optional)_ Whether or not daoLogin is enabled.                   |
| [providers?](ssx.ssxconfig.providers.md)           |           | [SSXProviders](../ssx.ssxproviders/)     | _(Optional)_ Connection to a cryptographic keypair and/or network. |
| [siweConfig?](ssx.ssxconfig.siweconfig.md)         |           | [SiweConfig](../ssx.siweconfig.md)       | _(Optional)_ Optional session configuration for the SIWE message.  |
| [storage?](ssx.ssxconfig.storage.md)               |           | [StorageModule](../ssx.storagemodule.md) | _(Optional)_                                                       |

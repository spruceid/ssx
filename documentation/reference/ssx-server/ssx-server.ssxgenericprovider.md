# ssxgenericprovider

[Home](https://github.com/spruceid/ssx/blob/main/documentation/reference/ssx-server/index.md) > [@spruceid/ssx-server](./) > [SSXGenericProvider](ssx-server.ssxgenericprovider.md)

### SSXGenericProvider type

Generic provider settings

**Signature:**

```typescript
export declare type SSXGenericProvider = {
    service: SSXRPCProviders;
    url?: string | ConnectionInfo;
    network?: providers.Networkish;
    apiKey?: string | SSXInfuraProviderProjectSettings;
};
```

**References:** [SSXRPCProviders](ssx-server.ssxrpcproviders.md), [SSXInfuraProviderProjectSettings](ssx-server.ssxinfuraproviderprojectsettings.md)

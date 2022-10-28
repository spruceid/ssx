# ssxproviders

[Home](https://github.com/spruceid/ssx/blob/main/documentation/reference/ssx-server/index.md) > [@spruceid/ssx-server](../) > [SSXProviders](./)

### SSXProviders interface

SSX web3 configuration settings

**Signature:**

```typescript
export interface SSXProviders 
```

### Properties

| Property                                                   | Modifiers | Type                                                                   | Description                                   |
| ---------------------------------------------------------- | --------- | ---------------------------------------------------------------------- | --------------------------------------------- |
| [metrics?](ssx-server.ssxproviders.metrics.md)             |           | [SSXMetricsProvider](../ssx-server.ssxmetricsprovider.md)              | _(Optional)_ Metrics service configurations   |
| [rpc?](ssx-server.ssxproviders.rpc.md)                     |           | [SSXRPCProvider](../ssx-server.ssxrpcprovider.md)                      | _(Optional)_ JSON RPC provider configurations |
| [sessionConfig?](ssx-server.ssxproviders.sessionconfig.md) |           | Partial<[SSXSessionStoreConfig](../ssx-server.ssxsessionstoreconfig/)> | _(Optional)_                                  |

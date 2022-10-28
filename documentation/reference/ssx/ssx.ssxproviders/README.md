# ssxproviders

[Home](https://github.com/spruceid/ssx/blob/main/documentation/reference/ssx-sdk/index.md) > [@spruceid/ssx](../) > [SSXProviders](./)

### SSXProviders interface

SSX web3 configuration settings

**Signature:**

```typescript
export declare interface SSXProviders 
```

### Properties

| Property                              | Modifiers | Type                                             | Description                                                                                                              |
| ------------------------------------- | --------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| [rpc?](ssx.ssxproviders.rpc.md)       |           | [SSXRPCProvider](../ssx.ssxrpcprovider.md)       | _(Optional)_ JSON RPC provider configurations                                                                            |
| [server?](ssx.ssxproviders.server.md) |           | [SSXProviderServer](../ssx.ssxproviderserver.md) | _(Optional)_ Optional reference to server running ssx-server. Providing this field enables communication with ssx-server |
| [web3?](ssx.ssxproviders.web3.md)     |           | [SSXProviderWeb3](../ssx.ssxproviderweb3/)       | _(Optional)_ Web3 wallet provider                                                                                        |

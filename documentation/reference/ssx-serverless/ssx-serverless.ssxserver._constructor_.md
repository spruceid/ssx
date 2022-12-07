<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@spruceid/ssx-serverless](./ssx-serverless.md) &gt; [SSXServer](./ssx-serverless.ssxserver.md) &gt; [(constructor)](./ssx-serverless.ssxserver._constructor_.md)

## SSXServer.(constructor)

Constructs a new instance of the `SSXServer` class

<b>Signature:</b>

```typescript
constructor(config: SSXServerConfig, session: SSXSessionCRUDConfig);
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config | [SSXServerConfig](./ssx-serverless.ssxserverconfig.md) | Base configuration of the SSXServer |
|  session | [SSXSessionCRUDConfig](./ssx-serverless.ssxsessioncrudconfig.md) | CRUD definition for session operations |

## Example


```
const ssx = new SSXServer({
  providers: {
    rpc: {
      service: SSXRPCProviders.SSXInfuraProvider,
      apiKey: process.env.INFURA_ID,
      network: SSXInfuraProviderNetworks.GOERLI,
    }
  }
}, {
    create: async <T>(value: any, opts?: Record<string, any>): Promise<T> => { },
    retrieve: async <T>(key: any, opts?: Record<string, any>): Promise<T> => { },
    update: async <T>(key: any, value: any, opts?: Record<string, any>): Promise<T> => { },
    delete: async <T>(key: any): Promise<T> => { },
});
```

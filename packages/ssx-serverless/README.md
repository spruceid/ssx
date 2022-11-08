!["SSX Header"](header.png "SSX Header")
# SSX Serverless
`ssx-serverless` is a serverless version of `ssx-server`. It's intended to make it easier to be used in this kind of architecture.

## Installing
```bash
npm install --save @spruceid/ssx-serverless
# OR
yarn add @spruceid/ssx-serverless
```

## Building

```bash
npm run build
# OR
yarn build
```

## Usage
The library exports a main class `SSXServer` which is supposed to be used as a Singleton. A basic configuration for this class would look like the following:

```typescript
import { 
  SSXServer,
  SSXRPCProviders,
  SSXInfuraProviderNetworks,
} from '@spruceid/ssx-serverless';

const _create = async <T>(value: any, opts?: Record<string, any>): Promise<T> => {
    return dynamoDb.put(value).promise() as T;
};

const ssx = new SSXServer({
  providers: {
    rpc: {
      service: SSXRPCProviders.SSXInfuraProvider,
      apiKey: process.env.INFURA_ID,
      network: SSXInfuraProviderNetworks.GOERLI,
    }
  }
}, {
    create: _create,
    retrieve: _retrieve,
    update: _update,
    delete: _delete,
});
```

For more information see the [example](../../examples/ssx-test-serverless-dynamodb-api/README.md).
---
description: SSX Serverless provides an optimized implementation for serverless
---

# Configuring SSX for Serverless

### Installation&#x20;

In order to enable ssx in your serverless app, install `ssx-serverless` with your preferred package manager by running any of the following commands:

```bash
npm install @spruceid/ssx-serverless
# or
yarn add @spruceid/ssx-serverless
# or 
pnpm install @spruceid/ssx-serverless
```

{% hint style="info" %}
`@spruceid/ssx-server` is not a dependency of `@spruceid/ssx-serverless`
{% endhint %}

### Usage

`ssx-serverless` exports the main class `SSXServer` which is supposed to be used as a Singleton. On your serverless setup, you'll need to create an instance of SSXServer as seen below.&#x20;

```javascript
import { 
  SSXServer,
  SSXRPCProviders,
  SSXInfuraProviderNetworks,
} from '@spruceid/ssx-serverless';

const _create = async <T>(value: any, opts?: Record<string, any>): Promise<T> => {
    return db.put(value) as T;
};

// ...

const ssx = new SSXServer({
  providers: {
    rpc: {
      service: SSXRPCProviders.SSXInfuraProvider,
      apiKey: process.env.INFURA_ID,
      network: SSXInfuraProviderNetworks.MAINNET,
    }
  }
}, {
    create: _create,
    retrieve: _retrieve,
    update: _update,
    delete: _delete,
});
```

SSXServer requires two objects to be instantiated.&#x20;

* The first object is the main object to configure the providers and enable daoLogin.&#x20;
* The second object is the object with the session management functions. &#x20;

```javascript
new SSXServer({
  providers?: {
    rpc?: SSXProvider,
    metrics?: {
      service: 'ssx',
      apiKey: string
    }
  },
  daoLogin?: boolean
}, {
  create: <T>(value: any, opts?: Record<string, any>) => Promise<T>,
  retrieve: <T>(key: any, opts?: Record<string, any>) => Promise<T>,
  update: <T>(key: any, value: any, opts?: Record<string, any>) => Promise<T>,
  delete: <T>(key: any, opts?: Record<string, any>) => Promise<T>
});
```

{% hint style="info" %}
Looking for an example to start? Check out the [AWS + Node.js + Typescript + DynamoDB example](https://github.com/spruceid/ssx/tree/main/examples/ssx-test-serverless-dynamodb-api)
{% endhint %}

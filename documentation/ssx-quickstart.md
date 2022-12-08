---
description: >-
  This guide will help you bootstrap an SSX application, or help add SSX to your
  existing setup
---

# ⚡ SSX Quickstart

{% hint style="info" %}
:zap: **Requirements**

* [Node.js](https://nodejs.org/en/)&#x20;
* Optional: [Yarn](https://yarnpkg.com/), [Pnpm](https://pnpm.io/)
{% endhint %}

## Create SSX Dapp

Starting from scratch? We have an easy way to get started with an application bootstrapped with Sign-In with Ethereum and SSX.&#x20;

Try using `create-ssx-dapp` to quickly bootstrap a dapp using SSX:

```bash
yarn create @spruceid/ssx-dapp
# OR
npx @spruceid/create-ssx-dapp
```

The repository for the `create-ssx-dapp` application can be found here:&#x20;

{% embed url="https://github.com/spruceid/ssx/tree/main/packages/create-ssx-dapp" %}

## Add SSX to Your Existing Dapp

SSX can be added as a dependency to your project using your preferred Node.js package manager by running any of the following commands.

```bash
npm install @spruceid/ssx
# or
yarn add @spruceid/ssx
# or 
pnpm install @spruceid/ssx
```

Once installed SSX can be instantiated at any point in your frontend dapp. Below is an example of a function that could be called on a sign-in button. This creates an SSX instance, prompts the user to connect and  Sign-In with Ethereum, and stores information about the user's session in the `ssx` object.&#x20;

```javascript
import { SSX } from "@spruceid/ssx";

const signIn = async () => {
    const ssx = new SSX({
      enableDaoLogin: true,
      resolveEns: true,
      providers: {
        web3: { driver: window.ethereum },
        server: { host: process.env.SERVER_URL },
      },
    });
    const { success, error, session } = await ssx.signIn();
    const { address, siwe, signature, ens: { domain } } = session;
};
```

## Installation on Server

In order to get started with `ssx-server`, install `ssx-server` with your preferred package manager by running any of the following commands:&#x20;

```bash
npm install @spruceid/ssx-server
# or
yarn add @spruceid/ssx-server
# or 
pnpm install @spruceid/ssx-server
```

{% hint style="info" %}
Looking for SSX support for serverless or other servers besides Express? Check out [Configuring SSX on other Servers](configuring-ssx/configuring-ssx-server.md)
{% endhint %}

### Express.js Middleware

On your server, you'll need to create an instance of `ssx-server` and pass it to an Express middleware layer, as seen below. `ssx-server` doesn't require configuration parameters to use, however, it's recommended to have the following variables set:

```javascript
import { SSXServer, SSXExpressMiddleware } from "@spruceid/ssx-server";

const ssx = new SSXServer({
  providers: {
    metrics: { service: "ssx", apiKey: process.env.SSX_API_KEY },
  },
});

// const app = express();
app.use(SSXExpressMiddleware(ssx));
/* It's possible to override the routes by passing a second parameter:
app.use(SSXExpressMiddleware(ssx, {
  nonce: '/ssx-custom-nonce',
  login: '/ssx-custom-login',
  logout: '/ssx-custom-logout',
})); */
```

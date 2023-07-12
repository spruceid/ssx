# ssx-server

SSX Server is a server-side library made to work with the SSX client libraries. SSX-Server provides authentication and session management, which can be enabled via an ExpressJS middleware or using the methods provided on the SSXServer class.

Full documentation for the SSX-Server SDK can be found at [docs.ssx.id](https://docs.ssx.id/readme-1#installation-on-server).

## Quickstart

You can add SSX to your server from npm:

```bash
yarn add @spruceid/ssx-server
# or
npm install @spruceid/ssx-server
# or
pnpm add @spruceid/ssx-server
```

> **Note:** Looking for SSX support for other servers besides Express? Check out [Configuring SSX on other Servers](https://docs.ssx.id/configuring-ssx/configuring-ssx-server).

On your server, you'll need to create an instance of ssx-server and pass it to an Express middleware layer, as seen below. ssx-server doesn't require configuration parameters to use, however it's recommended to have the following variables set:

```typescript
import express from 'express';
import { SSXServer, SSXExpressMiddleware } from '@spruceid/ssx-server';

const ssx = new SSXServer({
  signingKey: process.env.SSX_SIGNING_KEY,
  provider: {
    rpc: {
      service: 'infura',
      network: 'homestead',
      apiKey: process.env.INFURA_API_KEY ?? '',
    },
    metrics: {
      service: 'ssx',
      apiKey: process.env.SSX_API_TOKEN ?? '',
    },
  },
});

const app = express();

app.use(SSXExpressMiddleware(ssx));
app.listen(3001, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${3001}`);
});
```

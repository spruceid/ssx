# Configuring SSX Server

SSX aims to work with as many different servers and backend configurations as possible. Please [reach out](https://github.com/spruceid/ssx/issues/new) if you find your server configuration currently unsupported.

### Express

SSX has support for Express, and it is the default we assume for users of the library. Check out our guides on [SSX Server Quickstart](../ssx-quickstart.md#express.js-middleware) and [Scaling SSX Server](../scaling-ssx-server.md#adding-sessions-to-ssx) to see examples of how to use SSX with Express.

### Node HTTP Server Middleware

On your server, you'll need to create an instance of `ssx-server` and pass it to an HTTP middleware layer, as seen below. `ssx-server` doesn't require configuration parameters to use, however, it's recommended to have the following variables set:

```javascript
import http, { IncomingMessage, ServerResponse } from "http";
import { SSXServer, SSXHttpMiddleware } from "@spruceid/ssx-server";

const ssx = new SSXServer({
  providers: {
    metrics: { service: "ssx", apiKey: process.env.SSX_API_TOKEN },
  },
});

const ssxMiddleware = SSXHttpMiddleware(ssx);
/* It's possible to override the routes by passing a second parameter:
const ssxMiddleware = SSXHttpMiddleware(ssx, {
  nonce: '/ssx-custom-nonce',
  login: '/ssx-custom-login',
  logout: '/ssx-custom-logout',
}); */

const processRequest = async (req: IncomingMessage, res: ServerResponse) => { ... };

const requestListener = async (req: IncomingMessage, res: ServerResponse) => {
  await ssxMiddleware()(req, res);
  await processRequest(req, res);
};

const server = http.createServer(requestListener);
server.listen(3001);
```

---
description: >-
  Learn why and how to use session storage to scale your server's authentication
  mechanism
---

# 📈 Scaling SSX Server

{% hint style="info" %}
Interested in the code? [Jump to an example ](scaling-ssx-server.md#adding-sessions-to-ssx)scaling with Redis and SSX below!
{% endhint %}

## Why Scale?

Horizontal scaling is a type of scaling in which an application is scaled by adding more servers to the system, as opposed to increasing the power of a single server. This type of scaling is often used in web apps where the load on the system (incoming requests) can be divided among multiple servers.

Some benefits of horizontal scaling include:

1. **Increased scalability**: When an application is horizontally scaled, it can handle a larger number of requests because there are more servers available to process them.
2. **Improved reliability**: If one server in a horizontally scaled system goes down, there are still other servers that can handle the load. This can help to improve the overall reliability of the system.
3. **Reduced costs**: Horizontal scaling can be more cost-effective than vertical scaling because it often requires less hardware. When more servers are added to a system, each server can handle a smaller portion of the load, which can lead to lower costs.

### Handle Sessions at Scale

A shared session store allows you to share session data across multiple servers. This is important when you are scaling horizontally because it allows you to share session data between servers. This means that if a user logs in on one server, their session data will be available on all of the other servers. This makes it easier to manage session data and ensures that all of the servers have the same data.

<figure><img src=".gitbook/assets/Screen Shot 2022-09-16 at 6.06.00 PM.png" alt=""><figcaption><p>Decoupling session storage from the server allows for simpler horizontal scaling</p></figcaption></figure>

As part of handling end-to-end authentication, SSX makes it simple to scale by providing many compatible ways to configure your session store on Express, Connect or Node http servers.

## Adding Sessions to SSX

SSX comes with a default session manager that lives in memory. This is not advised for production use, as this store is volatile (if the server restarts, all data in the session store will be lost) and not scalable (other server instances cannot access this server's memory). We recommend using a [compatible session store](https://github.com/expressjs/session#compatible-session-stores) like Redis.

### Installation

```bash
yarn add @spruceid/ssx redis connect-redis
```

### Configuration in Express server

```javascript
import { SSXServer } from '@spruceid/ssx-server';
import { createClient } from 'redis';

// setup redis client
// this can occur in the connector or earlier in your server setup
const redisClient = createClient({
  legacyMode: true,
  url: process.env.REDIS_URL,
});

// connect to redis
redisClient.connect();

const ssx = new SSXServer({
  // ...other ssx configuration
  signingKey: process.env.SSX_SIGNING_KEY,
  providers: {
    sessionConfig: {
      store: (session) => {
        const redisStore = require('connect-redis')(session);
        return new redisStore({
          client: redisClient,
        });
      } 
    }
  },
});

// ...setup express app
// add to express middleware
app.use(SSXExpressMiddleware(ssx));

```

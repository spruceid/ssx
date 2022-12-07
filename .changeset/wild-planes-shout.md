---
'@spruceid/ssx-core': minor
'@spruceid/ssx': minor
'@spruceid/ssx-server': minor
---

Enable custom paths for endpoints on client and server.

## @spruceid/ssx-core changes: 
- Creates and exports `SSXServerRoutes` interface
- Adds `routes?: SSXServerRoutes` to `SSXClientConfig.providers.server`.

## @spruceid/ssx changes: 
Due to the change in `SSXClientConfig`, it now accepts the server's routes configuration:
```
const ssx = new SSX({
  providers: {
    server: {
        host: 'http://localhost:3001',
        routes: {
            nonce: '/ssx-custom-nonce',
            login: '/ssx-custom-login',
            logout: '/ssx-custom-logout',
        }
    }
  }
});
```
This is an optional configuration and the default values are: `nonce: '/ssx-nonce'`, `login: '/ssx-login'`, `logout: '/ssx-logout'`. It isn't necessary to override all of them, you can only override one of them.

## @spruceid/ssx-server changes: 
This now accepts the routes configuration when instantiating the middlewares as follows:
```
const expressMiddleware = SSXExpressMiddleware(ssx, { 
    nonce: '/ssx-custom-nonce', 
    login: '/ssx-custom-login',
    logout: '/ssx-custom-logout',
  });

// or

const httpMiddleware = SSXHttpMiddleware(ssx, { 
    nonce: '/ssx-custom-nonce', 
    login: '/ssx-custom-login',
    logout: '/ssx-custom-logout',
  });
```
The second parameter with the configuration object is optional and the default values are: `nonce: '/ssx-nonce'`, `login: '/ssx-login'`, `logout: '/ssx-logout'`. It isn't necessary to override all of them, you can only override one of them.
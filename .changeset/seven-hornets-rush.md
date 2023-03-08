---
'@spruceid/ssx-server-middleware': patch
---

This adds callbacks on ssx server middlewares routes. Usage example:

```js
SSXExpressMiddleware( // same to SSXHttpMiddleware
  ssx, 
  {
    login: {
      path: '/ssx-login',
      callback: (req: Request) => {
        console.log(`User ${req.body.address} successfully signed in`);
      }
    },
    logout: '/ssx-custom-logout'
  }
);
```

---
'@spruceid/ssx': minor
---

This adds the Credentials Modules, which allows developers to fetch credentials issued on SpruceKit Credential Issuer. 
This module requires Storage Module, so you must enable both to make it work.

```ts
const ssx = SSX({
  modules: {
    storage: true,
    credentials: true
  }
})

await ssx.signIn();

const { data } = ssx.credentials.list();
```

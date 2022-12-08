# samesite

[Home](index.md) > [@spruceid/ssx-server](ssx-server.md) > [SSXCookieOptions](ssx-server.ssxcookieoptions.md) > [sameSite](ssx-server.ssxcookieoptions.samesite.md)

### SSXCookieOptions.sameSite property

Prevents Cross Site Request Forgery Attacks by telling the browser to only send cookies with request from your site. The lax setting allows GET requests from other sites. Recommended true for production.

**Signature:**

```typescript
sameSite: boolean | 'lax' | 'strict' | 'none' | undefined;
```

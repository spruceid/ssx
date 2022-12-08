# ssxauthenticated

[Home](index.md) > [@spruceid/ssx-server](ssx-server.md) > [SSXAuthenticated](ssx-server.ssxauthenticated.md)

### SSXAuthenticated variable

This middleware function can be used to protect an Express route with SSX authentication. It will check for ssx.verified and if it is set, the route will be allowed to proceed. If it is not set, the route will redirect or return a 401 Unauthorized response, based on the value of the redirect property.

**Signature:**

```typescript
SSXAuthenticated: (redirectURL?: string) => (req: Request, res: Response, next: NextFunction) => void
```

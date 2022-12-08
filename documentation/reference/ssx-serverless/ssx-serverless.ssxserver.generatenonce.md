# generatenonce

[Home](index.md) > [@spruceid/ssx-serverless](ssx-serverless.md) > [SSXServer](ssx-serverless.ssxserver.md) > [generateNonce](ssx-serverless.ssxserver.generatenonce.md)

### SSXServer.generateNonce property

Generates a nonce for use in the SSX client libraries. Nonce is a random string that is used to prevent replay attacks. Wraps the generateNonce function from the SIWE library.

**Signature:**

```typescript
generateNonce: () => string;
```

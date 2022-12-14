<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@spruceid/ssx-serverless](./ssx-serverless.md) &gt; [SSXServer](./ssx-serverless.ssxserver.md) &gt; [getNonce](./ssx-serverless.ssxserver.getnonce.md)

## SSXServer.getNonce property

Generates a nonce and stores it in the current session if a sessionKey is provided or creates a new one if not.

<b>Signature:</b>

```typescript
getNonce: (getNonceOpts?: {
        sessionKey?: any;
        generateUpdateValue?: (nonce: string) => any;
        generateCreateValue?: (nonce: string) => any;
        createOpts?: Record<string, any>;
        updateOpts?: Record<string, any>;
    }) => Promise<{
        nonce: string;
        dbResult: any;
    }>;
```
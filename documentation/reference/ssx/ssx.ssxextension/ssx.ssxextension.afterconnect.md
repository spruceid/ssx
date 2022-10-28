# afterconnect

[Home](https://github.com/spruceid/ssx/blob/main/documentation/reference/ssx-sdk/index.md) > [@spruceid/ssx](../) > [SSXExtension](./) > [afterConnect](ssx.ssxextension.afterconnect.md)

### SSXExtension.afterConnect() method

Hook to run after SSX has connected to the user's wallet. This can return an object literal to override the session configuration before the user signs in.

**Signature:**

```typescript
afterConnect?(ssx: SSXConnected): Promise<ConfigOverrides>;
```

### Parameters

| Parameter | Type                                 | Description |
| --------- | ------------------------------------ | ----------- |
| ssx       | [SSXConnected](../ssx.ssxconnected/) |             |

**Returns:**

Promise<[ConfigOverrides](../ssx.configoverrides.md)>

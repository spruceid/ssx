# ssxlogfields

[Home](https://github.com/spruceid/ssx/blob/main/documentation/reference/ssx-server/index.md) > [@spruceid/ssx-server](../) > [SSXLogFields](./)

### SSXLogFields interface

Allowed fields for an SSX Log

**Signature:**

```typescript
export interface SSXLogFields 
```

### Properties

| Property                                           | Modifiers | Type                                                  | Description                                                        |
| -------------------------------------------------- | --------- | ----------------------------------------------------- | ------------------------------------------------------------------ |
| [content](ssx-server.ssxlogfields.content.md)      |           | string \| Record\<string, any>                        | Any JSON stringifiable structure to be logged                      |
| [timestamp?](ssx-server.ssxlogfields.timestamp.md) |           | string                                                | _(Optional)_ RFC-3339 time of resource generation, defaults to now |
| [type](ssx-server.ssxlogfields.type.md)            |           | [SSXEventLogTypes](../ssx-server.ssxeventlogtypes.md) | Type of content being logged                                       |
| [userId](ssx-server.ssxlogfields.userid.md)        |           | string                                                | Unique identifier for the user, formatted as a DID                 |

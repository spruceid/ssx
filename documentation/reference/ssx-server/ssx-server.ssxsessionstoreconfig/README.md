# ssxsessionstoreconfig

[Home](https://github.com/spruceid/ssx/blob/main/documentation/reference/ssx-server/index.md) > [@spruceid/ssx-server](../) > [SSXSessionStoreConfig](./)

### SSXSessionStoreConfig interface

SSX Session Store configuration settings

**Signature:**

```typescript
export interface SSXSessionStoreConfig 
```

### Properties

| Property                                                              | Modifiers | Type                     | Description                                                                                                                                                                          |
| --------------------------------------------------------------------- | --------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [sessionOptions?](ssx-server.ssxsessionstoreconfig.sessionoptions.md) |           | Partial\<SessionOptions> | _(Optional)_ Overrides for \[SessionOptions]\(https://github.com/DefinitelyTyped/DefinitelyTyped/blob/a24d35afe48f7fb702e7617b983ddca1904ba36b/types/express-session/index.d.ts#L52) |
| [store?](ssx-server.ssxsessionstoreconfig.store.md)                   |           | (session: any) => Store  | _(Optional)_ Connector for different stores                                                                                                                                          |

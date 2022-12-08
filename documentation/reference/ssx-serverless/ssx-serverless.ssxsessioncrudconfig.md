# ssxsessioncrudconfig

[Home](index.md) > [@spruceid/ssx-serverless](ssx-serverless.md) > [SSXSessionCRUDConfig](ssx-serverless.ssxsessioncrudconfig.md)

### SSXSessionCRUDConfig interface

Type definition for CRUD session functions

**Signature:**

```typescript
export interface SSXSessionCRUDConfig 
```

### Example

```
create: async <T>(value: any, opts?: Record<string, any>): Promise<T> => { },
retrieve: async <T>(key: any, opts?: Record<string, any>): Promise<T> => { },
update: async <T>(key: any, value: any, opts?: Record<string, any>): Promise<T> => { },
delete: async <T>(key: any): Promise<T> => { },
```

### Properties

| Property                                                    | Modifiers | Type                                                                   | Description                                  |
| ----------------------------------------------------------- | --------- | ---------------------------------------------------------------------- | -------------------------------------------- |
| [create](ssx-serverless.ssxsessioncrudconfig.create.md)     |           | \<T>(value: any, opts?: Record\<string, any>) => Promise\<T>           | Definition of the create function            |
| [delete](ssx-serverless.ssxsessioncrudconfig.delete.md)     |           | \<T>(key: any, opts?: Record\<string, any>) => Promise\<T>             | Definition of the delete function            |
| [retrieve](ssx-serverless.ssxsessioncrudconfig.retrieve.md) |           | \<T>(key: any, opts?: Record\<string, any>) => Promise\<T>             | Definition of the retrieve (search) function |
| [update](ssx-serverless.ssxsessioncrudconfig.update.md)     |           | \<T>(key: any, value: any, opts?: Record\<string, any>) => Promise\<T> | Definition of the update function            |

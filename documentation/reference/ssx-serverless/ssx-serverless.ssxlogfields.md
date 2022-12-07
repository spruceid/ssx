<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@spruceid/ssx-serverless](./ssx-serverless.md) &gt; [SSXLogFields](./ssx-serverless.ssxlogfields.md)

## SSXLogFields interface

Allowed fields for an SSX Log

<b>Signature:</b>

```typescript
export interface SSXLogFields 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [content](./ssx-serverless.ssxlogfields.content.md) |  | string \| Record&lt;string, any&gt; | Any JSON stringifiable structure to be logged |
|  [timestamp?](./ssx-serverless.ssxlogfields.timestamp.md) |  | string | <i>(Optional)</i> RFC-3339 time of resource generation, defaults to now |
|  [type](./ssx-serverless.ssxlogfields.type.md) |  | [SSXEventLogTypes](./ssx-serverless.ssxeventlogtypes.md) | Type of content being logged |
|  [userId](./ssx-serverless.ssxlogfields.userid.md) |  | string | Unique identifier for the user, formatted as a DID |

# ssxextension

[Home](index.md) > [@spruceid/ssx](ssx.md) > [SSXExtension](ssx.ssxextension.md)

### SSXExtension interface

Interface for an extension to SSX.

**Signature:**

```typescript
export declare interface SSXExtension 
```

### Properties

| Property                                    | Modifiers | Type   | Description                                 |
| ------------------------------------------- | --------- | ------ | ------------------------------------------- |
| [namespace?](ssx.ssxextension.namespace.md) |           | string | _(Optional)_ \[recap] Capability namespace. |

### Methods

| Method                                                    | Description                                                                                                                                                              |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [afterConnect(ssx)?](ssx.ssxextension.afterconnect.md)    | _(Optional)_ Hook to run after SSX has connected to the user's wallet. This can return an object literal to override the session configuration before the user signs in. |
| [afterSignIn(session)?](ssx.ssxextension.aftersignin.md)  | _(Optional)_ Hook to run after SSX has signed in.                                                                                                                        |
| [defaultActions()?](ssx.ssxextension.defaultactions.md)   | _(Optional)_ \[recap] Default delegated actions in capability namespace.                                                                                                 |
| [extraFields()?](ssx.ssxextension.extrafields.md)         | _(Optional)_ \[recap] Extra metadata to help validate the capability.                                                                                                    |
| [targetedActions()?](ssx.ssxextension.targetedactions.md) | _(Optional)_ \[recap] Delegated actions by target in capability namespace.                                                                                               |

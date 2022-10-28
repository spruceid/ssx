# ssxproviderweb3

[Home](https://github.com/spruceid/ssx/blob/main/documentation/reference/ssx-sdk/index.md) > [@spruceid/ssx](../) > [SSXProviderWeb3](./)

### SSXProviderWeb3 interface

Web3 provider configuration settings

**Signature:**

```typescript
export declare interface SSXProviderWeb3 
```

### Properties

| Property                                | Modifiers | Type | Description                                                                                                               |
| --------------------------------------- | --------- | ---- | ------------------------------------------------------------------------------------------------------------------------- |
| [driver](ssx.ssxproviderweb3.driver.md) |           | any  | window.ethereum for Metamask; web3modal.connect() for Web3Modal; const provider = useProvider() from Wagmi for Rainbowkit |

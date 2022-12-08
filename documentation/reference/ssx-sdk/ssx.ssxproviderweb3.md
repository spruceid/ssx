# ssxproviderweb3

[Home](index.md) > [@spruceid/ssx](ssx.md) > [SSXProviderWeb3](ssx.ssxproviderweb3.md)

### SSXProviderWeb3 interface

Web3 provider configuration settings

**Signature:**

```typescript
export declare interface SSXProviderWeb3 
```

### Properties

| Property                                | Modifiers | Type | Description                                                                                                                                              |
| --------------------------------------- | --------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [driver](ssx.ssxproviderweb3.driver.md) |           | any  | window.ethereum for Metamask; web3modal.connect() for Web3Modal; const signer = useSigner(); const provider = signer.provider; from Wagmi for Rainbowkit |

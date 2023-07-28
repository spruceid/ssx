# @spruceid/ssx-react

## 2.0.2

### Patch Changes

- Updated dependencies [c942c3c]
  - @spruceid/ssx@2.1.0

## 2.0.1

### Patch Changes

- Updated dependencies [ad0311d]
  - @spruceid/ssx@2.0.1

## 2.0.0

### Major Changes

- ## Major rework to enable customizability

  `@spruceid/ssx-react` no longer depends on `wagmi`. Instead, function hooks must be defined and used as arguments to the component.

  - `onChangeAccount` property no longer exists. Replaced by the `watchProvider` property, which now allows for more customizability.
  - `web3Provider.providerLoaded` property was also removed. The new architecture assumes the provider no longer needs to be initialized, and callback functions will be called when changes occur.
  - `useSSX` now returns the `ssx` instance and the `provider`.
  - Now `watchProvider` is the new interface for listening to provider changes. The developer must set up this function to be called whenever an interaction with the user happens. An example of how to do it can be found [here](https://github.com/spruceid/ssx/blob/main/examples/ssx-test-react/src/index.tsx#L25).

  ```tsx
  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import { WagmiConfig, useWalletClient } from 'wagmi';
  import { Web3Modal } from '@web3modal/react';
  import { SSXProvider } from '@spruceid/ssx-react';
  import {
    EthereumClient,
    w3mConnectors,
    w3mProvider,
  } from '@web3modal/ethereum';
  import { configureChains, createConfig } from 'wagmi';
  import { polygon, mainnet, goerli, sepolia } from 'wagmi/chains';
  import { type WalletClient } from '@wagmi/core';
  import { providers } from 'ethers';

  // 1. Get projectID at https://cloud.walletconnect.com
  if (!process.env.REACT_APP_PROJECT_ID) {
    console.error('You need to provide REACT_APP_PROJECT_ID env variable');
  }

  export const projectId = process.env.REACT_APP_PROJECT_ID ?? '';

  // 2. Configure wagmi client
  const chains = [mainnet, goerli, sepolia, polygon];

  const { publicClient } = configureChains(chains, [
    w3mProvider({ projectId }),
  ]);

  export const wagmiConfig = createConfig({
    autoConnect: false,
    connectors: w3mConnectors({ projectId, chains }),
    publicClient,
  });

  // 3. Configure modal ethereum client
  export const ethereumClient = new EthereumClient(wagmiConfig, chains);

  export function walletClientToEthers5Signer(walletClient: WalletClient) {
    const { account, chain, transport } = walletClient;
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new providers.Web3Provider(transport, network);
    const signer = provider.getSigner(account.address);
    return signer;
  }

  function SSXWithoutWatchProvider({ children }: any) {
    const { data: walletClient } = useWalletClient();

    const web3Provider = { provider: walletClient };

    return (
      <SSXProvider
        ssxConfig={{ siweConfig: { domain: 'localhost:3000' } }}
        web3Provider={web3Provider}>
        {children}
      </SSXProvider>
    );
  }

  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <WagmiConfig config={wagmiConfig}>
        <SSXWithoutWatchProvider>
          /* your code goes here */
        </SSXWithoutWatchProvider>
      </WagmiConfig>
      <Web3ModalV2 projectId={projectId} ethereumClient={ethereumClient} />
    </React.StrictMode>
  );
  ```

  You can [check here](https://github.com/spruceid/ssx/tree/main/examples/ssx-test-react) a more detailed example.

  ## Updated dependencies

  Updated several dependencies.

### Patch Changes

- Updated dependencies
  - @spruceid/ssx@2.0.0

## 1.3.5

### Patch Changes

- Updated dependencies [5e90f6a]
- Updated dependencies [5c2f20c]
  - @spruceid/ssx@1.4.0

## 1.3.4

### Patch Changes

- Updated dependencies
  - @spruceid/ssx@1.3.2

## 1.3.3

### Patch Changes

- Updated dependencies [7d799b7]
  - @spruceid/ssx@1.3.1

## 1.3.2

### Patch Changes

- Updated dependencies [95dcfee]
- Updated dependencies [6f85eb7]
  - @spruceid/ssx@1.3.0

## 1.3.1

### Patch Changes

- eddc834: Updates the ssx-react package by removing the `watchAccount` method used to manage the account switching and added `useAccount` instead.
- Updated dependencies [c3a1930]
- Updated dependencies [ce89464]
- Updated dependencies [eddc834]
  - @spruceid/ssx-authjs@1.1.0
  - @spruceid/ssx-server@1.2.4

## 1.3.0

### Minor Changes

- 94a507a: Implements an event listener that prompts the user with a new sign in message when they change the selected account in their connected wallet

### Patch Changes

- @spruceid/ssx@1.2.5
- @spruceid/ssx-server@1.2.3

## 1.2.5

### Patch Changes

- Updated dependencies
  - @spruceid/ssx@1.2.4

## 1.2.4

### Patch Changes

- This updates the ssx-react package in order to improve compatibility between all wagmi/rainbow-kit versions.

## 1.2.3

### Patch Changes

- Updated dependencies [aa228bc]
  - @spruceid/ssx@1.2.3

## 1.2.2

### Patch Changes

- @spruceid/ssx@1.2.2
- @spruceid/ssx-server@1.2.2

## 1.2.1

### Patch Changes

- Patch fix for build issue
- Updated dependencies
  - @spruceid/ssx@1.2.1
  - @spruceid/ssx-server@1.2.1

## 1.2.0

### Minor Changes

- 6205fc4: Added support for Next-Auth to `ssx-react`. This includes helper functions for configuring the frontend and backend components of an app using Next-Auth.

## 1.1.1

### Patch Changes

- Updated dependencies [b25cbde]
  - @spruceid/ssx@1.1.1

## 1.1.0

### Minor Changes

- 1c685c8: This allows a for different web3 providers to be passed to the ssx-react instance. It still uses wagmi.sh as the default provider if none is passed.

### Patch Changes

- c989838: Refactor code to avoid duplication and improve performance.

  - Updates `ssxConfig?: SSXConfig;` on `SSXProviderProps` to `ssxConfig?: SSXClientConfig;` (non breaking change).

- Updated dependencies [c989838]
- Updated dependencies [c66f308]
- Updated dependencies [83c314c]
  - @spruceid/ssx@1.1.0

## 1.0.0

### Major Changes

- f317c82: Public release of the SSX SDK

### Patch Changes

- Updated dependencies [f317c82]
- Updated dependencies [a91af88]
- Updated dependencies [1072382]
  - @spruceid/ssx@1.0.0

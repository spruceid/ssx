---
description: Add SSX to your React or Next.js dapp
---

# Configuring SSX with React

SSX React provides a React Provider and Hook for using SSX in React applications. It is meant to be used in conjunction with [wagmi.sh](https://wagmi.sh/) and is compatible with Next.js.

## Installation

```bash
npm install @spruceid/ssx-react
# OR
yarn add @spruceid/ssx-react
```

## Usage

`ssx-react` provides two key react components: a React Provider and a React **** Hook. The Provider is used to wrap components where SSX would be needed, and the Hook is used to access the SSX instance.

### Provider

#### Wagmi

The Provider is used to wrap the application. It takes a single prop, `ssxConfig`, which is the configuration object for the SSX instance. The Provider will create the SSX instance and make it available to the application via the Hook. An example is provided below:

```tsx
import { createClient, WagmiConfig } from 'wagmi';
import { SSXProvider } from '@spruceid/ssx-react';

const ssxConfig = {
 siweConfig: {
    statement: "Sign into my example dapp.",
  },
  providers: {
    backend: { host: "https://api.example.com/" },
  },
};

const wagmiClient = createClient({
  // your wagmi client configuration
  // configuration guide at https://wagmi.sh/docs/client
});

function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <SSXProvider ssxConfig={ssxConfig}>
        {/* enables useSSX hook in children */}
        <Component {...pageProps} />
      </SSXProvider>
    </WagmiConfig>
  );
}
```

#### Other Providers

If you're a web3 provider other than wagmi.sh, below is an example of how this can be done. Here we use Blocknative's [web3-onboard](https://github.com/blocknative/web3-onboard) provider.

```jsx
import '../styles/globals.css'
import { Web3OnboardProvider, init, useConnectWallet } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import { SSXProvider } from '@spruceid/ssx-react';

const web3Onboard = init({
  // your web3Onboard configuration
  // configuration guide at https://onboard.blocknative.com/docs/modules/core#initialization
});

/** 
* We create a component that wraps the SSX Provider. It accesses
* a web3 provider hook and passes it to the SSX Provider, before
* rendering any child components.
**/
function SSXWithWeb3Provider({ children }) {
  // we get the provider from @web3-onboard's react hook
  const [{ wallet }] = useConnectWallet();

  // we build the web3Provider object and pass it to the SSX Provider
  const web3Provider = {
    provider: wallet?.provider,
    providerLoaded: !!wallet?.provider,
  };

  const ssxConfig = {
    siweConfig: {
      statement: "Login to my app!",
    },
  };

  return (
    <SSXProvider ssxConfig={ssxConfig} web3Provider={web3Provider}> 
      {children}
    </SSXProvider>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <Web3OnboardProvider web3Onboard={web3Onboard}>
      <SSXWithWeb3Provider>
        <Component {...pageProps} />
      </SSXWithWeb3Provider>
    </Web3OnboardProvider>
  )
}

export default MyApp
```

### Hook

The Hook is used to access the SSX instance. It returns an object with the following properties:

* `ssx`: the SSX instance
* `ssxLoaded`: a boolean indicating whether the SSX is loaded and ready to use

```tsx
import { useSSX } from '@spruceid/ssx-react';

function MyComponent() {
  const { ssx, ssxLoaded } = useSSX();

  if (!ssxLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={() => ssx.signIn()}>Sign In</button>
    </div>
  );
}
```

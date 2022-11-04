# SSX React

SSX React provides a React Provider and Hook for using SSX in React applications. It is meant to be used in conjuction with (wagmi.sh)[https://wagmi.sh/].

## Installation

```bash
npm install @spruceid/ssx-react
```

## Usage
SSX React is installed two ways: a Provider and a Hook. The Provider is used to wrap the application, and the Hook is used to access the SSX instance.

### Provider
The Provider is used to wrap the application. It takes a single prop, `ssxConfig`, which is the configuration object for the SSX instance. The Provider will create the SSX instance and make it available to the application via the Hook.

```tsx
import { createClient, WagmiConfig } from 'wagmi';
import { SSXProvider } from '@spruceid/ssx-react';

const ssxConfig = {
 sessionConfig: {
    statement: "Sign into my example dapp.",
  },
  provider: {
    backend: { host: "https://api.example.com/" },
  },
};

const wagmiClient = createClient({
  // your wagmi client config
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
### Hook
The Hook is used to access the SSX instance. It returns an object with the following properties:
- `ssx`: the SSX instance
- `ssxLoaded`: a boolean indicating whether the SSX is loaded and ready to use

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


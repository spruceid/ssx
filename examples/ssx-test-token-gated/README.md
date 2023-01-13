# SSX ENS Token Gated + RainbowKit

This examples will enable signing in if the wallet trying to connect owns given token, a.k.a Token Gated Access. It will also cover how to integrate RainbowKit in a SSX powered dapp.

## Create the dapp
The initial setup of this example will be done using SSX's dapp creation tool. To acomplish that type the following in the terminal:

```bash
yarn create @spruceid/ssx-dapp token-gated-example
```

For this example we will be using the following options in the setup tool:
- Typescript
- Web3Modal (which we will replace later on)
- No WalletConnect
- Dao Login disabled
- No server configured (let it empty)

## Setup Alchemy Account
An Alchemy account will be required since `alchemy-sdk` is used to resolve the owned tokens from an account. To use it will an Alchemy API Key will be necessary.
In order to do that create a `.env.development` file and add the key like the following:

```bash
# token-gated-example/.env
REACT_APP_ALCHEMY_API_KEY=YOUR_KEY
```

## Setup Alchemy SDK
The SDK dependency can be installed with the following:
```bash
yarn add alchemy-sdk
```

## Setup RainbowKit
[RainbowKit](https://www.rainbowkit.com/) is used in this example. To add it the following dependencies will need to be installed:
```bash
yarn add @rainbow-me/rainbowkit wagmi
```

To use RainbowKit with SSX you will also need to add the `ssx-react` dependency, to acomplish that type the following in the terminal:
```bash
yarn add @spruceid/ssx-react
```

Head to `src/App.tsx` add the following:
```tsx
/** src/App.tsx **/

import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { goerli, mainnet, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { SSXProvider } from '@spruceid/ssx-react';

/**....**/

const { chains, provider } = configureChains(
  [mainnet, goerli],
  [
    alchemyProvider({
      // This is Alchemy's default API key.
      // You can get your own at https://dashboard.alchemyapi.io
      apiKey: `${process.env.REACT_APP_ALCHEMY_API_KEY}`,
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'SSX Token Gated Example',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
/**....**/
```

And wrap your `App()` component with `<WagmiConfig />`, `<RainbowKitProvider/>` and `<SSXProvider/>` components, making it look like the following:

```tsx
/* src/App.tsx */

function App() {
  const { ssx } = useSSX();
  const { openConnectModal } = useConnectModal();
  const [ session, setSession ] = useState<SSXClientSession>()

  useEffect(() => {
    if(ssx) {
      try {
        ssx?.signIn();
      } catch (err) {
        console.error(err);
        setSession(session);
      }
    }
  }, [ssx])

  const handleClick = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  }

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <SSXProvider>
          <div className="App">
            <div className="App-header">
              <img
                src={logo}
                className="App-logo"
                alt="logo"
              />
              <span>SSX</span>
            </div>
            <div className="App-title">
              <h1>SSX Example Dapp</h1>
              <h2>Connect and sign in with your Ethereum account</h2>
            </div>
            <div className="App-content">
              {
                ssx ?
                  <>
                    <AccountInfo
                      address={ssx?.address() || ''}
                    />
                  </> :
                  <button onClick={handleClick}>
                    SIGN-IN WITH ETHEREUM
                  </button>
              }
            </div>
          </div>
        </SSXProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
```

You are now able to run `yarn start` and sign-in using RainbowKit.

Now, in order to token gate this access and only enable it the previous code needs
some modification. First the configuration of the `alchemy-sdk` is needed, add the
following to `src/App.tsx`:
```tsx
/* src/App.tsx */
import { Network, Alchemy } from "alchemy-sdk";

/**....**/

const alchemyConfig = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(alchemyConfig);

/**....**/
```

With the SDK configured now the logic to verify if given address owns an ENS name
needs to be added, to do that we will first need to fetch all Tokens owned by it
and filter for ENS ones. ENS names are under the contract `0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85` so a variable with that value needs
to be added, add the following after the `import` statements:

```tsx
/* src/App.tsx */
const ENS_CONTRACT = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85';
```


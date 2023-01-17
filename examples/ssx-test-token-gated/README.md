# SSX ENS Token Gated + RainbowKit

This example will show developers how to enable token-gated access in their dapp with SSX. Additionally, it will show a developer how to integrate and use RainbowKit in an SSX-powered dapp.

To run the completed example:

- Add your Alchemy API key to .env (see below)
- Once SSX packages are installed (`yarn install` at ssx root folder), run `yarn install` and `yarn start` in this example directory.

Read on to learn how to build the example from scratch using our create-ssx-dapp example.

## Create the dapp

The initial setup will be done using SSX's dapp creation tool. Type the following in your terminal to get started:

```bash
yarn create @spruceid/ssx-dapp token-gated-example
```

For this example we will be using the following options in the setup tool:

- Typescript
- Leave the other options empty

## Setup Alchemy Account

An Alchemy account and API key will be necessary since alchemy-sdk is used to resolve tokens owned by an account.
To configure the key in the project create a `.env.development` file and add the key like the following:

```bash
# token-gated-example/.env
REACT_APP_ALCHEMY_API_KEY=YOUR_KEY
```

## Setup Alchemy SDK

The SDK dependency can be installed with the following command:

```bash
yarn add alchemy-sdk
```

## Setup RainbowKit

[RainbowKit](https://www.rainbowkit.com/) is used in this example. Add the required dependency by typing the following in your terminal:

```bash
yarn add @rainbow-me/rainbowkit wagmi
```

Additionally, you will also need to add the `ssx-react` dependency. To add it, type the following in the terminal:

```bash
yarn add @spruceid/ssx-react
```

Head to `src/index.tsx` and add the following:

```tsx
/** src/index.tsx **/

import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import {
  goerli,
  mainnet,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { SSXProvider } from '@spruceid/ssx-react';

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
  appName: 'SSX ENS Token Gated Example',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
```

Wrap your `<App />` component with `<WagmiConfig />`, `<RainbowKitProvider/>` and `<SSXProvider/>` components, making it look like the following:

```tsx
/* src/index.tsx */

root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <SSXProvider>
          <App />
        </SSXProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
```

At `src/App.tsx` some changes are required to hook SSX and RainbowKit. Head to the file and make the following changes:

```tsx
/* src/App.tsx */

import '@rainbow-me/rainbowkit/styles.css';
import { useConnectModal, useAccountModal } from '@rainbow-me/rainbowkit';
import { useSSX } from '@spruceid/ssx-react';
import { SSXClientSession } from '@spruceid/ssx';

function App() {
  /* SSX hook */
  const { ssx } = useSSX();
  /* RainbowKit ConnectModal hook */
  const { openConnectModal } = useConnectModal();
  /* RainbowKit Account modal hook */
  const { openAccountModal } = useAccountModal();
  /* Some control variables */
  const [session, setSession] = useState<SSXClientSession>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (ssx && loading) {
      /* Sign-in with SSX whenever the button is pressed */
      ssx
        .signIn()
        .then(session => {
          console.log(session);
          setSession(session);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setSession(undefined);
          setLoading(false);
        });
    }
  }, [ssx, loading]);

  useEffect(() => {
    if (!provider) {
      setSession(undefined);
    }
  }, [provider]);

  const handleClick = () => {
    /* Opens the RainbowKit modal if in the correct state */
    if (openConnectModal) {
      openConnectModal();
    }
    /* Triggers the Sign-in hook */
    setLoading(true);
  };

  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <span>SSX</span>
      </div>
      <div className="App-title">
        <h1>SSX Example Dapp</h1>
        <h2>Connect and sign in with your Ethereum account</h2>
      </div>
      <div className="App-content">
        {!openConnectModal && provider ? (
          <>
            <AccountInfo address={session.address} />
          </>
        ) : (
          <button onClick={handleClick}>SIGN-IN WITH ETHEREUM</button>
        )}
        {openAccountModal && ownEnsName && provider ? (
          <button onClick={openAccountModal}>{session?.address}</button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
```

You are now able to run `yarn start` and sign-in using RainbowKit.

In order to token gate this access the previous code needs
some modifications. First the configuration of the `alchemy-sdk` is needed, add the
following to `src/App.tsx`:

```tsx
/* src/App.tsx */
import { Network, Alchemy } from 'alchemy-sdk';

/**....**/

const alchemyConfig = {
  /* This is the same you used previously for RainbowKit */
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  /* Change this to the appropiate network for your usecase */
  network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(alchemyConfig);
/**....**/
```

With the SDK configured, we now need to add the logic to verify if the signed-in address owns a token. In this case, we'll be gating based on an ENS name. To accomplish this, tokens owned by the address must be fetched and filtered for ENS names. ENS names are under the contract `0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85`, so a variable with that value needs to be added. Add the following after the `import` statements:

```tsx
/* src/App.tsx */
const ENS_CONTRACT = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85';
```

Make the following changes to `src/App.tsx` to add the logic to fetch tokens:

```diff
/*....*/

+ import { Network, Alchemy } from "alchemy-sdk";

+ const alchemyConfig = {
+   /* This is the same you used previously for RainbowKit */
+   apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
+   /* Change this to the appropiate network for your usecase */
+   network: Network.ETH_GOERLI,
+ };

+ const alchemy = new Alchemy(alchemyConfig);

+ const ENS_CONTRACT = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85';

/*....*/

function App() {
  /* SSX hook */
  const { ssx } = useSSX();
  /* RainbowKit ConnectModal hook */
  const { openConnectModal } = useConnectModal();
  /* Some control variables */
  const [session, setSession] = useState<SSXClientSession>()
  const [loading, setLoading] = useState<boolean>(false)
+ const [ownEnsName, setOwnEnsName] = useState(false);

  useEffect(() => {
    if (ssx && loading) {
      /* Sign-in with SSX whenever the button is pressed */
      ssx.signIn()
         .then((session) => {
          console.log(session);
+         alchemy.nft.getNftsForOwner(`${ssx.address()}`)
+           .then((nfts) => {
+             const ownENS = nfts.ownedNfts
+               .filter(({ contract }) => contract.address === ENS_CONTRACT)?.length > 0;
+             setOwnEnsName(ownENS);
              setSession(session);
              setLoading(false);
+           });
+       })
        .catch((err) => {
          console.error(err);
+         setOwnEnsName(false);
          setSession(session);
          setLoading(false);
        });
    }
  }, [ssx, loading]);

  useEffect(() => {
    if (!provider) {
      setSession(undefined);
    }
  }, [provider]);

  const handleClick = () => {
    /* Opens the RainbowKit modal if in the correct state */
    if (openConnectModal) {
      openConnectModal();
    }
    /* Triggers the Sign-in hook */
    setLoading(true);
  }

  return (
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
-          session ?
+          !openConnectModal && ownEnsName && provider ?
            <>
              <AccountInfo
                address={session.address}
              />
            </> :
            <button onClick={handleClick}>
              SIGN-IN WITH ETHEREUM
            </button>
        }
        {
          openAccountModal && ownEnsName && provider ?
            <button onClick={openAccountModal}>
              {session?.address}
            </button>
            : <></>
        }
      </div>
+     <br></br>
+     {
+       !openConnectModal && ownEnsName && provider ?
+       "You own an ENS name." : <></>
+     }
    </div>
  );
}

export default App;
```

Now you can gate any content with ENS names just by checking the `ownEnsName` variable.

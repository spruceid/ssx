import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { WagmiConfig, useWalletClient } from 'wagmi';
import { ethereumClient, projectId, wagmiConfig } from './utils/web3modalV2Settings';
import { Web3Modal as Web3ModalV2 } from '@web3modal/react';
import { SSXProvider } from '@spruceid/ssx-react';
import './index.css';

function SSXWithWatchProvider({ children }: any) {
  const { data: walletClient } = useWalletClient();

  const web3Provider = {
    provider: walletClient,
  };

  return (
    <SSXProvider ssxConfig={{
      siweConfig: {
        domain: 'localhost:3000',
      },
    }} 
    web3Provider={web3Provider}
    /**
     * You can use the watchProvider property to control the
     * sign in/out and change account flows.
     */
    // watchProvider={async (provider, ssx) => {
    //   if(ssx) {
    //     // SignIn
    //     if(provider && !ssx.address()) {
    //       await ssx.signIn();
    //       return ssx;
          
    //     // Change Account
    //     } else if(provider && ssx.address() && provider.account.address !== ssx.address()) {
    //       await ssx.signOut();
    //       await ssx.signIn();
    //       return ssx;
          
    //       // SignOut
    //     } else {
    //       await ssx.signOut();
    //     }
    //   }
    // }}
    >
      {children}
    </SSXProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <SSXWithWatchProvider>
        <App />
      </SSXWithWatchProvider>
    </WagmiConfig>
    <Web3ModalV2
      projectId={projectId}
      ethereumClient={ethereumClient}
    />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

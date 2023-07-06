import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { WagmiConfig } from 'wagmi';
import { ethereumClient, projectId, wagmiConfig } from './utils/web3modalV2Settings';
import { Web3Modal as Web3ModalV2 } from '@web3modal/react';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <App />
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

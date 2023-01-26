import { useState } from "react";
import logo from './logo.svg';
import { SSX } from '@spruceid/ssx';
import './App.css';
import getSSXConfig from './ssx.config';

function AccountInfo({ address, delegator }: { address: string, delegator?: string }) {
  return (
    <div className="App-account-info">
      <h2>
        Account Info
      </h2>
      {
        address &&
        <p>
          <b>
            Address
          </b>
          <br />
          <code>
            {address}
          </code>
        </p>
      }
    </div>
  );
};

function App() {

  const [ssxProvider, setSSX] = useState<SSX | null>(null);

  const ssxHandler = async () => {
    const ssxConfig = await getSSXConfig();
    const ssx = new SSX(ssxConfig);
    await ssx.signIn();
    setSSX(ssx);
    (window as any).ssx = ssx;
  };

  const ssxLogoutHandler = async () => {
    ssxProvider?.signOut();
    setSSX(null);
  };

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
      <div className="App-content">
        {
          ssxProvider ?
            <>
              <button onClick={ssxLogoutHandler}>
                SIGN OUT
              </button>
              <AccountInfo
                address={ssxProvider?.address() || ''}
              />
            </> :
            <button onClick={ssxHandler}>
              SIGN-IN WITH ETHEREUM
            </button>
        }
      </div>
    </div>
  );
}

export default App;
import { useState } from "react";
import logo from './logo.svg';
import { SSX } from '@spruceid/ssx';
import './App.css';
import getSSXConfig from './ssx.config';
import AccountInfo from "./components/AccountInfo";



function App() {

  const [ssxProvider, setSSX] = useState<SSX | null>(null);
  const API_KEY = process.env.API_KEY;
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
  const contract = require("./artifacts/contracts/Posts.sol/Posts.json");
  console.log(JSON.stringify(contract.abi));

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
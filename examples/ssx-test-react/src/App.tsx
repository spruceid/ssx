import { useEffect, useState } from 'react';
import { SSX } from '@spruceid/ssx';
import Button from './components/Button';
import AccountInfo from './components/AccountInfo';
import { useWeb3Modal } from '@web3modal/react';
import { useSSX } from '@spruceid/ssx-react';
import './App.css';

declare global {
  interface Window {
    ssx: SSX;
  }
}

function App() {
  const { ssx, provider } = useSSX();
  const { open: openWeb3Modal } = useWeb3Modal();

  const [loading, setLoading] = useState<boolean>(false);
  
  const ssxHandler = async () => {
      return openWeb3Modal();
  };

  /** 
   * You don't need this function if you're using the watchProvider
   * property configured to signIn/Out
   */
  const signInUsingWeb3Modal = async () => {
    // SignIn
    if(provider && !ssx?.address()) {
      setLoading(true);
      try {
        await ssx?.signIn();
      } catch(e) {
        console.error(e);
      }
      setLoading(false);
    }
  }

  /**
   * You don't need this function if you're using the watchProvider
   * property configured to signIn/Out
   */
  useEffect(() => {
    if(ssx && provider) {
      signInUsingWeb3Modal();
    }
    if(ssx && !provider) {
      ssx.signOut();
    }
  //eslint-disable-next-line
  }, [provider, ssx]);
  
  const session = ssx?.session();

  return (
    <div className='App'>
      <div className='Header'>
        <span className='Header-span'>
          SSX
        </span>
      </div>
      <div className='Title'>
        <h1 className='Title-h1'>
          SSX Test App
        </h1>
        <h2 className='Title-h2'>
          Connect and sign in with your Ethereum account
        </h2>
      </div>
      <div className='Content'>
        <div className='Content-container'>
          {
            session ?
              <>
                <Button
                  id='signOutButton'
                  onClick={ssxHandler}
                  loading={loading}
                >
                  SIGN-OUT
                </Button>
                <AccountInfo
                  session={session}
                />
              </> :
              <>
                <Button
                  id='signInButton'
                  onClick={ssxHandler}
                  loading={loading}
                >
                  SIGN-IN WITH ETHEREUM
                </Button>
              </>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
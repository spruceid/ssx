import {
  useEffect,
  useState
} from 'react';
import {
  SSX
} from '@spruceid/ssx';
import Header from './Header';
import Title from './Title';
import Button from './Button';
import {
  useSigner
} from 'wagmi';
import {
  useWeb3Modal
} from "@web3modal/react";

const Main = () => {

  const [ssxProvider, setSSX] = useState(null);

  const { open: openWeb3Modal } = useWeb3Modal();
  const { data: signer, isLoading: wagmiIsLoading } = useSigner();


  const initSSX = async (signer) => {
    if (signer) {
      let ssxConfig = {
        providers: {
          web3: {
            driver: signer.provider
          }
        }
      };

      const ssx = new SSX(ssxConfig);
      try {
        await ssx.signIn();
        setSSX(ssx);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSSX(null);
    }
  }

  useEffect(() => {
    initSSX(signer)
  }, [signer])


  const ssxHandler = async () => {
    await openWeb3Modal()
  };

  return <>
    <Header />
    <Title />

    <div className='Content'>
      <div className='Content-container'>
        <Button
          onClick={ssxHandler}
          loading={wagmiIsLoading}
        >
          {
            ssxProvider ?
              ssxProvider?.address() :
              'SIGN-IN WITH ETHEREUM'
          }
        </Button>
      </div>
    </div>
  </>
};

export default Main;
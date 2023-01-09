import { useEffect, useState } from 'react';
import Header from './Header';
import Title from './Title';
import Button from './Button';
import { Network, Alchemy } from "alchemy-sdk";
import { useSSX } from '@spruceid/ssx-react';
import {
  useConnectModal,
} from '@rainbow-me/rainbowkit';

const ENS_CONTRACT = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85';

const alchemyConfig = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(alchemyConfig);

const TokenGatedContent = () => {
  const [ownEnsName, setOwnEnsName] = useState(false);
  const [loading, setLoading] = useState();
  const { ssx } = useSSX();
  const [address, setAddress] = useState('');
  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    if(ssx) {
      try {
        ssx?.signIn().then(() => {
          alchemy.nft.getNftsForOwner(ssx?.address()).then((nfts) => {
            const ownENS = nfts.ownedNfts.filter(({ contract }) => contract.address === ENS_CONTRACT)?.length > 0;
            setOwnEnsName(ownENS);
            setAddress(ssx?.address());
            setLoading(false);
          });
        });
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
  }, [ssx])

  const handleClick = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  }

  return (
    <div className='App'>
      <Header />
      <Title />
      <div className='Content'>
        <div className='Content-container'>
          {
            address ?
              ownEnsName ?
                <>
                  <img src='/own_ens.gif' alt='You own an ENS name.'></img>
                </> : <> No ENS name found.</> :
              <>
                <Button
                  onClick={handleClick}
                  loading={loading}
                >
                  SIGN-IN WITH ETHEREUM
                </Button>
              </>
          }
        </div>
      </div>
      <br></br>
      {
        address ?
          ownEnsName ?
            "You own an ENS name." : <></> : <></>
      }
    </div>
  )
}

export default TokenGatedContent;

import { useState } from 'react';
import Header from './Header';
import Title from './Title';
import Button from './Button';
import { Network, Alchemy } from "alchemy-sdk";
import { useSSX } from '@spruceid/ssx-react';

const ENS_CONTRACT = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85';

const alchemyConfig = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(alchemyConfig);

const TokenGatedContent = () => {
  const [ownEnsName, setOwnEnsName] = useState(false);
  const [loading, setLoading] = useState(false);
  const { ssx } = useSSX();
  const [address, setAddress] = useState('');

  const ssxHandler = async () => {
    setLoading(true);
    try {
      await ssx?.signIn();
      const nfts = await alchemy.nft.getNftsForOwner(ssx?.address());
      const ownENS = nfts.ownedNfts.filter(({ contract }) => contract.address === ENS_CONTRACT)?.length > 0;

      setOwnEnsName(ownENS);
      setAddress(ssx?.address());
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

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
                  onClick={ssxHandler}
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

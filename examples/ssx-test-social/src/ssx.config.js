import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';

const getSSXConfig = async () => {

  const driver = await new Web3Modal({
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
      },
    },
  }).connect();

  return { 
    enableDaoLogin: true,
    //resolveEns: true,
    providers: {
      web3: {  driver }
    }
  };
};

export default getSSXConfig; 
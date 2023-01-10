import {
  SSX
} from '@spruceid/ssx';
import {
  configureChains,
  createClient,
  watchSigner
} from '@wagmi/core';
import {
  goerli,
  mainnet
} from '@wagmi/core/chains';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider
} from '@web3modal/ethereum';
import {
  Web3Modal
} from '@web3modal/html';

// 1. Define constants
const projectId = import.meta.env.VITE_PROJECT_ID;
const chains = [mainnet, goerli];

// 2. Configure wagmi client
const {
  provider
} = configureChains(chains, [walletConnectProvider({
  projectId
})]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [...modalConnectors({
    appName: 'web3Modal',
    chains
  })],
  provider
});

// 3. Create ethereum and modal clients
const ethereumClient = new EthereumClient(wagmiClient, chains);

export const web3Modal = new Web3Modal({
  projectId,
  walletImages: {
    safe: 'https://pbs.twimg.com/profile_images/1566773491764023297/IvmCdGnM_400x400.jpg'
  }
},
  ethereumClient
);

const updateButtonLabel = (label) => {
  document.getElementById('signInBtn').textContent = label;
};

const unwatch = watchSigner({},
  async (signer) => {
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
        ssx.signIn()
          .then(session => {
            updateButtonLabel(session.address);
          });
      } catch (err) {
        console.error(err);
      }
    } else {
      updateButtonLabel("SIGN-IN WITH ETHEREUM");
    }
  },
);

export const signIn = () => {
  web3Modal.openModal();
};

document.getElementById('signInBtn').addEventListener('click', signIn);
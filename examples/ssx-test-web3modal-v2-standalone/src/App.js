
import { useEffect, useState, useCallback } from 'react';
import { apiGetChainNamespace } from "caip-api";
import UniversalProvider from "@walletconnect/universal-provider";
import { Web3Modal } from "@web3modal/standalone";
import { providers } from "ethers";
import { SSX } from "@spruceid/ssx";
import Button from './components/Button';
import Header from './components/Header';
import Title from './components/Title';
import { getAllChainNamespaces } from './utils/utils';
import { DEFAULT_LOGGER, DEFAULT_PROJECT_ID, DEFAULT_RELAY_URL } from './utils/constants';
import './App.css';

function App() {

  const [ethereumProvider, setEthereumProvider] = useState();
  const [isInitializing, setIsInitializing] = useState(false);
  const [web3Modal, setWeb3Modal] = useState();
  const [chainData, setChainData] = useState({});
  const [ssx, setSSX] = useState();

  const loadChainData = async () => {
    const namespaces = getAllChainNamespaces();
    const chainData = {};
    await Promise.all(
      namespaces.map(async namespace => {
        let chains;
        try {
          chains = await apiGetChainNamespace(namespace);
        } catch (e) {
          // ignore error
        }
        if (typeof chains !== "undefined") {
          chainData[namespace] = chains;
        }
      }),
    );
    setChainData(chainData);
  };


  const init = async () => {
    try {
      setIsInitializing(true);

      await loadChainData();

      const provider = await UniversalProvider.init({
        projectId: DEFAULT_PROJECT_ID,
        logger: DEFAULT_LOGGER,
        relayUrl: DEFAULT_RELAY_URL,
      });

      const web3Modal = new Web3Modal({
        projectId: DEFAULT_PROJECT_ID,
      });

      setEthereumProvider(provider);
      setWeb3Modal(web3Modal);
    } catch (err) {
      throw err;
    } finally {
      setIsInitializing(false);
    }
  }

  const createSSXInstance = async (web3Provider) => {
    const ssx = new SSX({
      providers: {
        web3: {
          driver: web3Provider
        }
      }
    });

    await ssx.signIn()
    setSSX(ssx)
  }

  const createWeb3Provider = (ethereumProvider, address) => {
    const web3Provider = new providers.Web3Provider(ethereumProvider);
    createSSXInstance(web3Provider);
  };


  const connect = async (caipChainId, pairing) => {
    if (!ethereumProvider) {
      throw new ReferenceError("WalletConnect Client is not initialized.");
    }

    const chainId = caipChainId.split(":").pop();

    console.log("Enabling EthereumProvider for chainId: ", chainId);

    const customRpcs = Object.keys(chainData.eip155).reduce(
      (rpcs, chainId) => {
        rpcs[chainId] = chainData.eip155[chainId].rpc[0];
        return rpcs;
      },
      {},
    );

    await ethereumProvider.connect({
      namespaces: {
        eip155: {
          methods: [
            "eth_sendTransaction",
            "eth_signTransaction",
            "eth_sign",
            "personal_sign",
            "eth_signTypedData",
          ],
          chains: [`eip155:${chainId}`],
          events: ["chainChanged", "accountsChanged"],
          rpcMap: customRpcs,
        },
      },
      pairingTopic: pairing?.topic,
    });

    const _accounts = await ethereumProvider.enable();
    createWeb3Provider(ethereumProvider, _accounts[0]);

    web3Modal?.closeModal();
  };

  const disconnect = async () => {
    if (typeof ethereumProvider === "undefined") {
      throw new Error("ethereumProvider is not initialized");
    }
    await ethereumProvider.disconnect();
    setSSX(undefined);
  };


  const _subscribeToProviderEvents = useCallback(
    async (_client) => {
      if (typeof _client === "undefined") {
        throw new Error("WalletConnect is not initialized");
      }

      _client.on("display_uri", async (uri) => {
        console.log("EVENT", "QR Code Modal open");
        web3Modal?.openModal({ uri });
      });

      // Subscribe to session ping
      _client.on("session_ping", ({ id, topic }) => {
        console.log("EVENT", "session_ping");
        console.log(id, topic);
      });

      // Subscribe to session event
      _client.on("session_event", ({ event, chainId }) => {
        console.log("EVENT", "session_event");
        console.log(event, chainId);
      });

      // Subscribe to session update
      _client.on(
        "session_update",
        ({ topic, session }) => {
          console.log("EVENT", "session_updated");
          console.log(session)
        },
      );

      // Subscribe to session delete
      _client.on("session_delete", ({ id, topic }) => {
        console.log("EVENT", "session_deleted");
        console.log(id, topic);
      });
    },
    [web3Modal],
  );

  useEffect(() => {
    if (ethereumProvider && web3Modal) _subscribeToProviderEvents(ethereumProvider);
  }, [_subscribeToProviderEvents, ethereumProvider, web3Modal]);


  useEffect(() => {
    init();
    // eslint-disable-next-line
  }, []);


  return (
    <div className='App'>
      <Header />
      <Title />

      <div className='Content'>
        <div className='Content-container'>
          {
            ssx ?
              <Button onClick={disconnect} >
                SIGN-OUT
              </Button> :
              <Button
                onClick={() => connect('eip155:1')}
                loading={isInitializing}
              >
                {
                  isInitializing ?
                    'INITIALIZING...' :
                    'SIGN-IN WITH ETHEREUM'
                }
              </Button>
          }
          {
            ssx ?
              <div className='AccountInfo'>
                <h2 className='AccountInfo-h2'>
                  Account Info
                </h2>
                <p>
                  <b className='AccountInfo-label'>
                    Address
                  </b>
                  <br />
                  <code className='AccountInfo-value'>
                    {ssx.address()}
                  </code>
                </p>
              </div> :
              null
          }
        </div>
      </div>
    </div>
  );
};

export default App;
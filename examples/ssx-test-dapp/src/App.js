import { useState, useEffect } from 'react';
import { SSX } from '@spruceid/ssx';
import Web3Modal from 'web3modal';
import Header from './components/Header';
import Title from './components/Title';
import Dropdown from './components/Dropdown';
import RadioGroup from './components/RadioGroup';
import Input from './components/Input';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Button from './components/Button';
import AccountInfo from './components/AccountInfo';
import { useWeb3Modal } from '@web3modal/react';
import { useSigner } from 'wagmi';
import './App.css';


function App() {

  const { open: openWeb3Modal } = useWeb3Modal();
  const { data: signer, isLoading: wagmiIsLoading } = useSigner();

  const [loading, setLoading] = useState(false);

  const [ssxProvider, setSSX] = useState(null);
  const [provider, setProvider] = useState('MetaMask');
  const [enableDaoLogin, setDaoLogin] = useState('Off');
  const [server, setServer] = useState('Off');
  const [resolveEns, setResolveEns] = useState('Off');
  const [resolveLens, setResolveLens] = useState('Off');
  const [siweConfig, setSiweConfig] = useState('Off');
  const [infuraId, setInfuraId] = useState('');
  const [host, setHost] = useState('');
  const [resolveOnServer, setResolveOnServer] = useState('Off');
  const [resolveEnsDomain, setResolveEnsDomain] = useState('On');
  const [resolveEnsAvatar, setResolveEnsAvatar] = useState('On');
  // siweConfig Fields
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState('');
  const [domain, setDomain] = useState('');
  const [nonce, setNonce] = useState('');
  const [issuedAt, setIssuedAt] = useState('');
  const [expirationTime, setExpirationTime] = useState('');
  const [requestId, setRequestId] = useState('');
  const [notBefore, setNotBefore] = useState('');
  const [resources, setResources] = useState('');
  const [statement, setStatement] = useState('');
  // ssx module config
  const [encryptionEnabled, setEncryptionEnabled] = useState('On');
  const [message, setMessage] = useState(null);
  const [ciphertext, setCiphertext] = useState(null);
  const [decrypted, setDecrypted] = useState(null);

  const getSSXConfig = () => {
    let ssxConfig = {};

    if (server === 'On') {
      ssxConfig = {
        providers: {
          ...ssxConfig?.provider,
          server: {
            host
          },
        }
      }
    }

    if (siweConfig === 'On') {
      const siweConfig = {};
      if (address) siweConfig.address = address;
      if (chainId) siweConfig.chainId = chainId;
      if (domain) siweConfig.domain = domain;
      if (nonce) siweConfig.nonce = nonce;
      if (issuedAt) siweConfig.issuedAt = issuedAt;
      if (expirationTime) siweConfig.expirationTime = expirationTime;
      if (requestId) siweConfig.requestId = requestId;
      if (notBefore) siweConfig.notBefore = notBefore;
      if (resources) siweConfig.resources = resources.split(',').map(r => r.trim());
      if (statement) siweConfig.statement = statement;
      ssxConfig = {
        ...ssxConfig,
        ...(siweConfig && { siweConfig })
      }
    }

    ssxConfig = {
      ...ssxConfig,
      enableDaoLogin: enableDaoLogin === 'On'
    }

    if (resolveEns === 'On') {
      ssxConfig = {
        ...ssxConfig,
        resolveEns: {
          resolveOnServer: resolveOnServer === 'On',
          resolve: {
            domain: resolveEnsDomain === 'On',
            avatar: resolveEnsAvatar === 'On'
          }
        }
      }
    }

    if (resolveLens === 'On' || resolveLens === 'onServer') {
      ssxConfig = {
        ...ssxConfig,
        resolveLens: resolveLens === 'On' ? true : resolveLens
      }
    }

    const modules = {};
    if (encryptionEnabled === "On") {
      modules.encryption = true; 
    }

    if (modules) {
      ssxConfig = {
        ...ssxConfig,
        modules
      }
    }

    return ssxConfig;
  };

  const initSSX = async (signer) => {
    if (signer) {
      let ssxConfig = getSSXConfig();

      ssxConfig = {
        ...ssxConfig,
        providers: {
          ...ssxConfig.providers,
          web3: {
            driver: signer.provider
          }
        }
      }

      const ssx = new SSX(ssxConfig);
      try {
        await ssx.signIn();
        setSSX(ssx);
      } catch (err) {
        console.error(err);
      }
    } else {
      ssxProvider && ssxProvider.signOut();
      setSSX(null);
    }
  };

  useEffect(() => {
    initSSX(signer);
    // eslint-disable-next-line
  }, [signer]);

  const ssxHandler = async () => {
    if (provider === 'Web3Modal v2') {
      return openWeb3Modal();
    }

    setLoading(true);
    let ssxConfig = getSSXConfig();

    if (provider !== 'MetaMask') {
      let driver;
      if (provider === 'Web3Modal') {
        driver = await new Web3Modal().connect();
      } else {
        driver = await new Web3Modal({
          providerOptions: {
            walletconnect: {
              package: WalletConnectProvider,
              options: {
                infuraId,
              },
            },
          },
        }).connect();
      }
      ssxConfig = {
        ...ssxConfig,
        providers: {
          ...ssxConfig.providers,
          web3: { driver }
        }
      }
    }

    const ssx = new SSX(ssxConfig);
    try {
      await ssx.signIn();
      setSSX(ssx);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const encryptionHandler = async () => {
    if (!ssxProvider) {
      throw Error("No SSX Instance found");
    }
    if (message === "") {
      throw Error("No message to encrypt")
    }
    // convert content to blob
    const blob = new Blob([message], {type: "text/plain"});
    const encryptedData = await ssxProvider.encryption.encrypt(blob);
    setCiphertext(JSON.stringify(encryptedData))
  }

  const decryptionHandler = async () => {
    if (!ssxProvider) {
      throw Error("No SSX Instance found");
    }
    if (ciphertext === "") {
      throw Error("No ciphertext to decrypt")
    }
    const parsedCiphertext = JSON.parse(ciphertext)
    const decryptedData = await ssxProvider.encryption.decrypt(parsedCiphertext);
    const text = await decryptedData.text()
    setDecrypted(text);
  }

  const ssxLogoutHandler = async () => {
    if (provider === 'Web3Modal v2') {
      return openWeb3Modal();
    }

    ssxProvider.signOut();
    setSSX(null);
  };

  return (
    <div className='App'>

      <Header />
      <Title />
      <div className='Content'>
        <div className='Content-container'>
          {
            ssxProvider ?
              <>
                <Button
                  id='signOutButton'
                  onClick={ssxLogoutHandler}
                  loading={loading || wagmiIsLoading}
                >
                  SIGN OUT
                </Button>
                <AccountInfo
                  address={ssxProvider?.address()}
                  session={ssxProvider?.session}
                />
              </> :
              <>
                <Button
                  id='signInButton'
                  onClick={ssxHandler}
                  loading={loading || wagmiIsLoading}
                >
                  SIGN-IN WITH ETHEREUM
                </Button>
              </>
          }
          <Dropdown 
            id='selectPreferences'
            label='Select Preference(s)'
          >
            <div className='Dropdown-item'>
              <span className='Dropdown-item-name'>
                Provider
              </span>
              <div className='Dropdown-item-options'>
                <RadioGroup
                  name='provider'
                  options={['MetaMask', 'Web3Modal', 'Web3Modal and WalletConnect', 'Web3Modal v2']}
                  value={provider}
                  onChange={setProvider}
                  inline={false}
                />
              </div>
            </div>
            <div className='Dropdown-item'>
              <span className='Dropdown-item-name'>
                daoLogin
              </span>
              <div className='Dropdown-item-options'>
                <RadioGroup
                  name='enableDaoLogin'
                  options={['On', 'Off']}
                  value={enableDaoLogin}
                  onChange={setDaoLogin}
                />
              </div>
            </div>
            <div className='Dropdown-item'>
              <span className='Dropdown-item-name'>
                Server
              </span>
              <div className='Dropdown-item-options'>
                <RadioGroup
                  name='server'
                  options={['On', 'Off']}
                  value={server}
                  onChange={setServer}
                />
              </div>
            </div>
            <div className='Dropdown-item'>
              <span className='Dropdown-item-name'>
                resolveEns
              </span>
              <div className='Dropdown-item-options'>
                <RadioGroup
                  name='resolveEns'
                  options={['On', 'Off']}
                  value={resolveEns}
                  onChange={setResolveEns}
                />
              </div>
            </div>
            <div className='Dropdown-item'>
              <span className='Dropdown-item-name'>
                resolveLens
              </span>
              <div className='Dropdown-item-options'>
                <RadioGroup
                  name='resolveLens'
                  options={['On', 'Off', 'onServer']}
                  value={resolveLens}
                  onChange={setResolveLens}
                />
              </div>
            </div>
            <div className='Dropdown-item'>
              <span className='Dropdown-item-name'>
                siweConfig
              </span>
              <div className='Dropdown-item-options'>
                <RadioGroup
                  name='siweConfig'
                  options={['On', 'Off']}
                  value={siweConfig}
                  onChange={setSiweConfig}
                />
              </div>
            </div>
            <div className='Dropdown-item'>
              <span className='Dropdown-item-name'>
                Encryption
              </span>
              <div className='Dropdown-item-options'>
                <RadioGroup
                  name='encryptionEnabled'
                  options={['On', 'Off']}
                  value={encryptionEnabled}
                  onChange={setEncryptionEnabled}
                />
              </div>
            </div>
          </Dropdown>
          {
            provider === 'Web3Modal + WalletConnect' ?
              <Input
                label='Infura ID'
                value={infuraId}
                onChange={setInfuraId}
              /> :
              null
          }
          {
            server === 'On' ?
              <Input
                label='Host'
                value={host}
                onChange={setHost}
              /> :
              null
          }
          {
            resolveEns === 'On' ?
              <>
                <RadioGroup
                  label='Resolve ENS on Server'
                  name='resolveOnServer'
                  options={['On', 'Off']}
                  value={resolveOnServer}
                  onChange={setResolveOnServer}
                />
                <RadioGroup
                  label='Resolve ENS Domain'
                  name='resolveEnsDomain'
                  options={['On', 'Off']}
                  value={resolveEnsDomain}
                  onChange={setResolveEnsDomain}
                />
                <RadioGroup
                  label='Resolve ENS Avatar'
                  name='resolveEnsAvatar'
                  options={['On', 'Off']}
                  value={resolveEnsAvatar}
                  onChange={setResolveEnsAvatar}
                />
              </> :
              null
          }
          {
            siweConfig === 'On' ?
              <div>
                <Input
                  label='Address'
                  value={address}
                  onChange={setAddress}
                />
                <Input
                  label='Chain ID'
                  value={chainId}
                  onChange={setChainId}
                />
                <Input
                  label='Domain'
                  value={domain}
                  onChange={setDomain}
                />
                <Input
                  label='Nonce'
                  value={nonce}
                  onChange={setNonce}
                />
                <Input
                  label='Issued At'
                  value={issuedAt}
                  onChange={setIssuedAt}
                />
                <Input
                  label='Expiration Time'
                  value={expirationTime}
                  onChange={setExpirationTime}
                />
                <Input
                  label='Request ID'
                  value={requestId}
                  onChange={setRequestId}
                />
                <Input
                  label='Not Before'
                  value={notBefore}
                  onChange={setNotBefore}
                />
                <Input
                  label='Resources'
                  value={resources}
                  onChange={setResources}
                />
                <Input
                  label='Statement'
                  value={statement}
                  onChange={setStatement}
                />
              </div> :
              null
          }
        </div>
      </div>
      
      {
          encryptionEnabled === "On"
          && ssxProvider
          && <div className='Content' style={{marginTop: '30px'}}>
          <div className='Content-container'>

            <Input
                label='Message to Encrypt'
                value={message}
                onChange={setMessage}
              />
              <Button
                id='encryptButton'
                onClick={encryptionHandler}
              >
                Encrypt
              </Button>

              <Input
                label='Message to Decrypt'
                value={ciphertext}
                onChange={setCiphertext}
              />
              <Button
                id='decryptButton'
                onClick={decryptionHandler}
                enabled={ciphertext}
              >
                Decrypt
              </Button>
              {
                decrypted &&  <h2 className='Title-h2'>
                  Decrypted message: "{decrypted}"
                </h2>
              }
            </div>
          </div>

        }
    </div>
  );
}

export default App;
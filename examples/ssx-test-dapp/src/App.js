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
import StorageModule from './StorageModule';
import './App.css';


function App() {

  const { open: openWeb3Modal } = useWeb3Modal();
  const { isLoading: wagmiIsLoading } = useSigner();

  const [loading, setLoading] = useState(false);

  const [ssx, setSSX] = useState(null);
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
  const [storageEnabled, setStorageEnabled] = useState('On');

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

    if (encryptionEnabled === "On") {
      modules.storage = true;
    }

    if (modules) {
      ssxConfig = {
        ...ssxConfig,
        modules
      }
    }

    return ssxConfig;
  };


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
    window.ssx = ssx;

    try {
      await ssx.signIn();
      setSSX(ssx);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const ssxLogoutHandler = async () => {
    if (provider === 'Web3Modal v2') {
      return openWeb3Modal();
    }

    ssx.signOut();
    setSSX(null);
  };

  return (
    <div className='App'>

      <Header />
      <Title />
      <div className='Content'>
        <div className='Content-container'>
          {
            ssx ?
              <>
                <Button
                  id='signOutButton'
                  onClick={ssxLogoutHandler}
                  loading={loading || wagmiIsLoading}
                >
                  SIGN OUT
                </Button>
                <AccountInfo
                  address={ssx?.address()}
                  session={ssx?.session}
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
            <div className='Dropdown-item'>
              <span className='Dropdown-item-name'>
                Storage
              </span>
              <div className='Dropdown-item-options'>
                <RadioGroup
                  name='storageEnabled'
                  options={['On', 'Off']}
                  value={storageEnabled}
                  onChange={setStorageEnabled}
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
        && ssx
        && <EncryptMessage ssx={ssx}/>
      }

      {
        storageEnabled === "On"
        && ssx
        && <StorageModule />
      }
    </div>
  );

  function EncryptMessage({ ssx }) {
    const [message, setMessage] = useState(null);
    const [ciphertext, setCiphertext] = useState(null);
    const [decrypted, setDecrypted] = useState(null);
    const [encrypted, setEncrypted] = useState(null);
    const [copied, setCopied] = useState(false);

    const encryptionHandler = async () => {
      if (!ssx) {
        throw Error("No SSX Instance found");
      }
      if (message === "") {
        throw Error("No message to encrypt")
      }
      // convert content to blob
      const blob = new Blob([message], { type: "text/plain" });
      const encryptedData = await ssx.encryption.encrypt(blob);
      setCiphertext(JSON.stringify(encryptedData, null,2))
    }
  
    const decryptionHandler = async () => {
      if (!ssx) {
        throw Error("No SSX Instance found");
      }
      if (ciphertext === "") {
        throw Error("No ciphertext to decrypt")
      }
      const parsedCiphertext = JSON.parse(ciphertext)
      const decryptedData = await ssx.encryption.decrypt(parsedCiphertext);
      const text = await decryptedData.text()
      setDecrypted(text);
    }

    const copyHandler = () => {
      console.log("hello?")
      navigator.clipboard.writeText(ciphertext)
      setCopied(true)
      console.log(copied)
    }
  
    useEffect(() => {
      setCopied(false)
      // eslint-disable-next-line
    }, [ciphertext]);

    return <div className='Content' style={{ marginTop: '30px' }}>
      <div className='Content-container'>

        <Input
          label='Message to Encrypt'
          value={message}
          onChange={setMessage} />
        <Button
          id='encryptButton'
          onClick={encryptionHandler}
        >
          Encrypt
        </Button>

        <Input
          label='Message to Decrypt'
          onChange={setEncrypted} />
        <Button
          id='decryptButton'
          onClick={decryptionHandler}
          enabled={encrypted}
        >
          Decrypt
        </Button>
        {decrypted && <h2 className='Title-h2'>
          Decrypted message: "{decrypted}"
        </h2>}
        {ciphertext && <div className='CipherText'>
          <pre style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
            ciphertext: "{ciphertext}"
          </pre>
          <Button
            id='copytoClipboard'
            onClick={copyHandler}>
            Copy
          </Button>
          {copied && <p style={{ textAlign: "right", color: "#667080" }}>Copied to clipboard!</p>}
        </div>}
      </div>
    </div>;
  }
  
  // function StorageModule() {

  
  //   const handleGetContent = (content) => {
  //     setSelectedContent(content);
  //     setName(content.name);
  //     setText(content.text);
  //   };
  
  //   const handleDeleteContent = (content) => {
  //     setContentList((prevList) => prevList.filter((c) => c !== content));
  //     setSelectedContent(null);
  //     setName('');
  //     setText('');
  //   };
  
  //   const handlePostContent = () => {
  //     if (selectedContent) {
  //       setContentList((prevList) =>
  //         prevList.map((c) =>
  //           c === selectedContent ? { name, text } : c
  //         )
  //       );
  //       setSelectedContent(null);
  //     } else {
  //       setContentList((prevList) => [...prevList, { name, text }]);
  //     }
  //     setName('');
  //     setText('');
  //   };
  
  //   return (
  //     <div className='Content' style={{ marginTop: '30px' }}>
  //       <div className='storage-container Content-container'>
  //         <div className='List-pane'>
  //           <h3>List Pane</h3>
  //           {contentList.map((content) => (
  //             <div key={content.name}>
  //               <span>{content.name}</span>
  //               <button onClick={() => handleGetContent(content)}>Get</button>
  //               <button onClick={() => handleDeleteContent(content)}>
  //                 Delete
  //               </button>
  //             </div>
  //           ))}
  //         </div>
  //         <div className='View-pane'>
  //           <h3>View/Edit/Post Pane</h3>
  //           <input
  //             type='text'
  //             placeholder='Name'
  //             value={name}
  //             onChange={(e) => setName(e.target.value)}
  //           />
  //           <input
  //             type='text'
  //             placeholder='Text'
  //             value={text}
  //             onChange={(e) => setText(e.target.value)}
  //           />
  //           <button onClick={handlePostContent}>Post</button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
  
}

export default App;
import { useState } from 'react';
import { SSX } from '@spruceid/ssx';
import Web3Modal from 'web3modal';
import Header from './components/Header';
import Title from './components/Title';
import Dropdown from './components/Dropdown';
import RadioGroup from './components/RadioGroup';
import Input from './components/Input';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Button from './components/Button';
import './App.css';

function AccountInfo({ address, session }) {
  return (
    <div className='AccountInfo'>
      <h2 className='AccountInfo-h2'>
        Account Info
      </h2>
      {
        session?.ens &&
          (
            session?.ens.domain || session?.ens.avatarUrl ||
            session?.ens.ensName || session?.ens.ensAvatarUrl
          ) ?
          <div>
            <b className='AccountInfo-label'>
              ENS
            </b>
            <br />
            <div className='AccountInfo-container'>
              {
                session.ens.avatarUrl || session.ens.ensAvatarUrl ?
                  <img
                    className='AccountInfo-avatar'
                    src={session.ens.avatarUrl ?? session.ens.ensAvatarUrl}
                    alt='ENS avatar'
                  /> :
                  null
              }
              {
                session.ens.domain || session.ens.ensName ?
                  <code className='AccountInfo-value'>
                    {session.ens.domain || session.ens.ensName}
                  </code> :
                  null
              }
            </div>
          </div> :
          null
      }
      <p>
        <b className='AccountInfo-label'>
          Address
        </b>
        <br />
        <code className='AccountInfo-value'>
          {address}
        </code>
      </p>
    </div>
  );
};

function App() {

  const [loading, setLoading] = useState(false);

  const [ssxProvider, setSSX] = useState(null);
  const [provider, setProvider] = useState('MetaMask');
  const [enableDaoLogin, setDaoLogin] = useState('Off');
  const [server, setServer] = useState('Off');
  const [resolveEns, setResolveEns] = useState('Off');
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

  const ssxHandler = async () => {
    setLoading(true);
    let ssxConfig = {};

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
        providers: { web3: { driver } }
      }
    }

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

    const ssx = new SSX(ssxConfig);
    try {
      await ssx.signIn();
      setSSX(ssx);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const ssxLogoutHandler = async () => {
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
                  onClick={ssxLogoutHandler}
                  loading={loading}
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
                  onClick={ssxHandler}
                  loading={loading}
                >
                  SIGN-IN WITH ETHEREUM
                </Button>
              </>
          }
          <Dropdown label='Select Preference(s)'>
            <div className='Dropdown-item'>
              <span className='Dropdown-item-name'>
                Provider
              </span>
              <div className='Dropdown-item-options'>
                <RadioGroup
                  name='provider'
                  options={['MetaMask', 'Web3Modal', 'Web3Modal + WalletConnect']}
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
    </div>
  );
}

export default App;
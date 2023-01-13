import { useAccountModal } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { useSigner } from 'wagmi';
import logo from '../logo.svg';
import Button from './Button';

const Header = () => {
  const { openAccountModal } = useAccountModal();
  const { data: provider } = useSigner();
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (provider) {
      provider.getAddress().then(setAddress);
    } else {
      setAddress('');
    }
  }, [provider]);

  return (
    <div className='Header'>
      <img
        src={logo}
        className='Header-logo'
        alt='logo'
      />
      <span className='Header-span'>
        SSX
      </span>
      {
        provider && openAccountModal ?
          <div className='Header-account'>
            <Button onClick={() => openAccountModal()}>
              {address}
            </Button>
          </div>
          : <></>
      }
    </div>
  )
};

export default Header;

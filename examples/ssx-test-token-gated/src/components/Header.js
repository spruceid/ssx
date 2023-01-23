import { ConnectButton } from '@rainbow-me/rainbowkit';
import logo from '../logo.svg';

const Header = ({ ownEnsName }) => {

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
        ownEnsName ?
          <div className='Header-account'>
            <ConnectButton />
          </div>
          : <></>
      }
    </div>
  )
};

export default Header;

import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  NextRouter,
  useRouter
} from "next/router";

interface IHeader {
  connectButton?: boolean;
}

const Header = ({ connectButton = false }: IHeader) => {

  const router: NextRouter = useRouter();

  return <div className='Header'>
    <div
      className='Header-container'
      onClick={() => router.push('/')}
    >
      <img
        src='/logo.svg'
        className='Header-logo'
        alt='logo'
      />
      <div className='Header-span'>
        SSX
      </div>
    </div>
    {
      connectButton ?
        <div className='Header-button--connect'>
          <ConnectButton />
        </div> :
        null
    }
  </div>
};

export default Header;
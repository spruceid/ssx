import getSSXConfig from '../ssx.config';
import { SSX } from '@spruceid/ssx';
import AccountInfo from './AccountInfo';

const Login = (props:any) => {

    const ssxHandler = async () => {
        const ssxConfig = await getSSXConfig();
        console.log(ssxConfig)
        const ssx = new SSX(ssxConfig);
        console.log(ssx)
        await ssx.signIn();
        props.setSSX(ssx);
        (window as any).ssx = ssx;
      };
    
      const ssxLogoutHandler = async () => {
        props.provider?.signOut();
        props.setSSX(null);
      };
    
    return (
        <div className="App-content">
        {
          props.ssxProvider ?
            <>
              <button onClick={ssxLogoutHandler}>
                SIGN OUT
              </button>
              <AccountInfo
                address={props.ssxProvider?.address() || ''}
              />
            </> :
            <button onClick={ssxHandler}>
              SIGN-IN WITH ETHEREUM
            </button>
        }
      </div>
    );
}

export default Login;
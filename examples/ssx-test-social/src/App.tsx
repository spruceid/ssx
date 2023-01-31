import React, { createContext, useState } from 'react';
import { Button } from '@material-ui/core';
import AccountInfo from './components/AccountInfo';
import NewPost from './components/NewPost';
import Feed from './components/Feed';
import { SSX } from '@spruceid/ssx';
import getSSXConfig from './ssx.config';
import PostContextProps from './interfaces/iPostContext';
import './App.css';
import Post from './interfaces/iPost';
import { flexbox } from '@mui/system';

function App() {
  const [ssxProvider, setSSXProvider] = useState<SSX | null>(null);
  const [posts, setPosts] = useState<Post[]>([])

  const PostContext = createContext<PostContextProps>({
    ssxProvider: null,
    setSSXProvider: () => { },
    posts: [],
    setPosts: () => { }
  });

  const handleLogin = async () => {
    const ssxConfig = await getSSXConfig();
    const ssx = new SSX(ssxConfig);
    await ssx.signIn();
    setSSXProvider(ssx);
  };

  const handleLogout = async () => {
    ssxProvider?.signOut();
    setSSXProvider(null);
  };

  function loggedOut() {
    return (
      <PostContext.Provider value={{ ssxProvider, setSSXProvider, posts, setPosts }}>
        <div className='App'>
          <div style={{ width: 'auto', display: 'flex', justifyContent: 'center' }}>
            <Button style={{ width: "25rem" }} onClick={handleLogin}>
              LOG IN TO ADD POSTS
            </Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', height: 'auto', width: 'auto' }}>
            <Feed postContext={PostContext} />
          </div>
        </div>
      </PostContext.Provider >
    )
  }

  function loggedIn() {
    return (
      <PostContext.Provider value={{ ssxProvider, setSSXProvider, posts, setPosts }}>
        <div className='App'>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'right' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left' }}>
              <NewPost postContext={PostContext} />
              <Feed postContext={PostContext} />
            </div>
            <div style={{ width: 'auto', marginLeft: '15rem', marginRight:'2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <AccountInfo address={ssxProvider?.address() || ''} />
              <Button style={{ width: "25rem" }} onClick={handleLogout}>LOG OUT</Button>
            </div>
          </div>
        </div>
      </PostContext.Provider >
    )
  }

  if (ssxProvider) {
    return loggedIn()
  }
  else {
    return loggedOut()
  }
  // return (
  //   <PostContext.Provider value={{ ssxProvider, setSSXProvider, posts, setPosts }}>
  //     <div className='App'>
  //       {
  //         ssxProvider ?
  //           <>
  //             <div style={{ width: 'auto', marginRight: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
  //               <AccountInfo address={ssxProvider?.address() || ''} />
  //               <Button style={{ width: "25rem" }} onClick={handleLogout}>LOG OUT</Button>
  //             </div>
  //             <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', height: 'auto', width: 'auto' }}>
  //               <NewPost postContext={PostContext} />
  //             </div>
  //           </> :
  //           <>
  //             <div style={{ width: 'auto', display: 'flex', justifyContent: 'center' }}>
  //               <Button style={{ width: "25rem" }} onClick={handleLogin}>
  //                 LOG IN TO CREATE POST
  //               </Button>
  //             </div>
  //           </>
  //       }
  //       <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', height: 'auto', width: 'auto' }}>
  //         <Feed postContext={PostContext} />
  //       </div>
  //     </div>
  //   </PostContext.Provider >
  // );
}


export default App;
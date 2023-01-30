import React, { createContext, useEffect, useState } from 'react';
import { Grid, Button, Typography, Container, Box } from '@material-ui/core';
import AccountInfo from './components/AccountInfo';
import NewPost from './components/NewPost';
import Feed from './components/Feed';
import { SSX } from '@spruceid/ssx';
import getSSXConfig from './ssx.config';
import PostContextProps from './interfaces/iPostContext';
import './App.css';
import Post from './interfaces/iPost';

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


  return (
    <PostContext.Provider value={{ ssxProvider, setSSXProvider, posts, setPosts }}>
      <div className='App'>
      {
        ssxProvider ?
        <>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
        <NewPost postContext={PostContext} />
        <div style={{ width: 'auto', marginRight: '2rem',display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <AccountInfo address={ssxProvider?.address() || ''} />
          <Button style={{width: "25rem"}} onClick={handleLogout}>LOG OUT</Button>
        </div>
        </div>
        </> :
        <>
        <div style={{ width: 'auto', display: 'flex', justifyContent: 'center' }}>
        <Button style={{width: "25rem"}} onClick={handleLogin}>
        LOG IN TO CREATE POST
      </Button>
        </div>
        </>
      }
      <Feed postContext={PostContext} />
    </div>
    </PostContext.Provider >
  );
}


// const getPosts = async () => {
//   const prevPosts: Post[] = await PostsContract.getAllPosts()
//   console.log(prevPosts)
//   return prevPosts
// }

// const [posts, setPosts] = useState(getPosts())

export default App;
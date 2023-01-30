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
        <Grid container spacing={1} justifyContent="flex-end">
          <Grid item xs={2} >
            <AccountInfo address={ssxProvider?.address() || ''} />
            <Button variant="contained"
              onClick={handleLogout}
            >
              LOG OUT
            </Button>
          </Grid>
        </Grid>
        <NewPost postContext={PostContext} />
        <Button onClick={handleLogin}>
          LOG IN TO CREATE POST
        </Button>
        <Feed postContext={PostContext} />
      </div>
    </PostContext.Provider>
  );
}


// const getPosts = async () => {
//   const prevPosts: Post[] = await PostsContract.getAllPosts()
//   console.log(prevPosts)
//   return prevPosts
// }

// const [posts, setPosts] = useState(getPosts())

export default App;
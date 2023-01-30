import React, { createContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, Typography, Container } from '@material-ui/core';
import AccountInfo from './components/AccountInfo';
import NewPost from './components/NewPost';
import Feed from './components/Feed';
import { SSX } from '@spruceid/ssx';
import getSSXConfig from './ssx.config';
import PostContextProps from './interfaces/iPostContext';
import Post from './interfaces/iPost';
import postsContract from './contract';

function App() {
  const [ssxProvider, setSSXProvider] = useState<SSX | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const PostContext = createContext<PostContextProps>({ 
    posts: [], 
    setPosts: () => {},
    ssxProvider: null,
    setSSXProvider: () => {}
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

  useEffect(() => {
    async function fetchPosts() {
      const posts = await postsContract.getAllPosts();
      console.log(posts)
      setPosts(posts);
    }

    fetchPosts();
  },[]);

  return (
    <PostContext.Provider value={{ posts, setPosts, ssxProvider, setSSXProvider }}>
      <div>
        <Grid container>
          {
            ssxProvider ?
              <>
                <Grid item xs={12}>
                  <AccountInfo address={ssxProvider?.address() || ''} />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleLogout}
                  >
                    LOG OUT
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <NewPost postContext={PostContext} />
                </Grid>
              </> :
              <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={handleLogin}>
                  LOG IN
                </Button>
              </Grid>
          }
          <Grid item xs={12}>
            <Feed postContext={PostContext} />
          </Grid>
        </Grid>
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
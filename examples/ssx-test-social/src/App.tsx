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
  const [newPost, setNewPost] = useState<boolean>(false);

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


  const PostContext = createContext<PostContextProps>({ 
    ssxProvider: null,
    setSSXProvider: () => {},
    newPost: false,
    setNewPost: () => {}
  });

  return (
    <PostContext.Provider value={{ ssxProvider, setSSXProvider, newPost, setNewPost }}>
      <div>
                  {/* <AccountInfo address={ssxProvider?.address() || ''} />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleLogout}
                  >
                    LOG OUT
                  </Button>
                  <NewPost postContext={PostContext} />
                <Button variant="contained" color="primary" onClick={handleLogin}>
                  LOG IN
                </Button> */}
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
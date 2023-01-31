import { Box, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import PostContextProps from '../interfaces/iPostContext';
import Post from '../interfaces/iPost';
import React from 'react';
import SinglePost from './SinglePost';


function Feed({ postContext }: { postContext: React.Context<PostContextProps> }) {
  const { ssxProvider, posts } = useContext(postContext);

  useEffect(() => {
    console.log('posts updated');
  }, [posts]);

  function OnePlusPosts() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' , marginTop: '2rem'}}>
        {posts.map((post, index) => (
          <SinglePost key={index} user={post.user} postText={post.postText} />
        ))}
      </div>
    );
  }

  if (posts && posts.length > 0) {
    return OnePlusPosts()
  }
  else {
    return <div></div>
  }
}

export default Feed;




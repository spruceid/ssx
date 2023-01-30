import { Box, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import PostContextProps from '../interfaces/iPostContext';
import Post from '../interfaces/iPost';
import React from 'react';



function Feed({ postContext }: { postContext: React.Context<PostContextProps> }) {
  const { ssxProvider, posts } = useContext(postContext);

  useEffect(() => {
    console.log('posts updated');
  }, [posts]);

  function OnePlusPosts(){
    const listItems = posts.map((p) =>
      <li>{p.postText}</li>
    );
    return (
      <ul>{listItems}</ul>
    );
  }
  
  if (posts && posts.length > 0) {
    return OnePlusPosts()
  }
  else {
    return <div></div>
  }

 
  // return (
  //   <List>
  //     {posts.map((post, index) => (
  //       <ListItem key={index}>
  //         <ListItemText
  //           primary={post.user}
  //           secondary={
  //             <Typography>
  //               {post.text}
  //             </Typography>
  //           }
  //         />
  //       </ListItem>
  //     ))}
  //   </List>
  // );
  // return (
  //   <div>
  //     Empty
  //   </div>

  // );

}

export default Feed;


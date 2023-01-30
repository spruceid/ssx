import { Box, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import PostContextProps from '../interfaces/iPostContext';
import PostsContract from '../contract';
import Post from '../interfaces/iPost';
import React from 'react';



function Feed({ postContext }: { postContext: React.Context<PostContextProps> }) {
  const { newPost } = useContext(postContext);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      console.log("fetching posts")
      const allPosts = await PostsContract.getAllPosts();
      console.log("done")
      setPosts(allPosts);
    }

    fetchPosts();
  }, [newPost]);

  function thereArePosts(){
    const listItems = posts.map((p) =>
      <li>{p.postText}</li>
    );
    return (
      <ul>{listItems}</ul>
    );
  }
  
  if (posts && posts.length > 0) {
    return thereArePosts()
  }
  else {
    return <div>Nothing</div>
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


import { useContext, useEffect, useState } from 'react';
import PostContextProps from '../interfaces/iPostContext';
import React from 'react';
import SinglePost from './SinglePost';


function Feed({ postContext }: { postContext: React.Context<PostContextProps> }) {
  const { posts } = useContext(postContext);

  useEffect(() => {
  }, [posts]);

  function PostsExist() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2rem' }}>
        {posts.map((post, index) => (
          <SinglePost key={index} user={post.user} postText={post.postText} />
        ))}
      </div>
    );
  }

  if (posts && posts.length > 0) {
    return PostsExist()
  }
  return <div></div>
}

export default Feed;




import { useContext, useState } from "react";
import { TextField, Button } from '@material-ui/core';
import PostContextProps from "../interfaces/iPostContext";
import { SSX } from "@spruceid/ssx";
import Post from "../interfaces/iPost";

function NewPost({ postContext }: { postContext: React.Context<PostContextProps> }) {
  const { ssxProvider, posts, setPosts } = useContext(postContext);
  const [text, setText] = useState('');


  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const address = (ssxProvider instanceof SSX && typeof ssxProvider.address() !== 'undefined')
    ? ssxProvider.address()!
    : null;
    const post: Post = { postText: text, user: address }
    setPosts([...posts, post])
    setText('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Text"
        variant="outlined"
        onChange={(e) => setText(e.target.value)}
      />
      <Button type="submit" variant="contained" color="primary">
        Create Post
      </Button>
    </form>
  );

}

export default NewPost;
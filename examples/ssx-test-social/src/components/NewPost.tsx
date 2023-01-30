import { useContext, useState } from "react";
import { TextField, Button } from '@material-ui/core';
import Post from '../interfaces/iPost'
import PostContextProps from "../interfaces/iPostContext";
import postsContract from '../contract'
import { SSX } from "@spruceid/ssx";

function NewPost({ postContext }: { postContext: React.Context<PostContextProps> }) {
  const { ssxProvider, setNewPost, newPost } = useContext(postContext);
  const [text, setText] = useState('');


  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const address = (ssxProvider instanceof SSX && typeof ssxProvider.address() !== 'undefined')
    ? ssxProvider.address()!
    : null;
    const tx = await postsContract.addPost(text, address)
    await tx.wait();
    const post: Post = { postText: text, user: address }
    setNewPost(!newPost)
    console.log("After set", newPost)
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
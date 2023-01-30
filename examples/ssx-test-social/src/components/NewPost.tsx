import { useContext, useState } from "react";
import { TextField, Button } from '@material-ui/core';
import Post from '../interfaces/iPost'
import PostContextProps from "../interfaces/iPostContext";
import postsContract from '../contract'
import { SSX } from "@spruceid/ssx";

function NewPost({ postContext }: { postContext: React.Context<PostContextProps> }) {
  const { posts, setPosts, ssxProvider } = useContext(postContext);
  const [post, setPost] = useState<Post>();
  const [text, setText] = useState('');

  function handleChange(event: any) {
    setText(event.target.value);
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const address = (ssxProvider instanceof SSX && typeof ssxProvider.address() !== 'undefined')
    ? ssxProvider.address()!
    : null;
    console.log("hello?")
    const tx = await postsContract.addPost(text, address)
    console.log(tx)
    await tx.wait();
    console.log("still moving")
    const post: Post = { text: text, user: address, id: Math.random() }
    setPosts([...posts, post]);
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
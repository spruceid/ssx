import { useContext, useState } from "react";
import { TextField, Button, InputAdornment, IconButton } from '@material-ui/core';
import PostContextProps from "../interfaces/iPostContext";
import { SSX } from "@spruceid/ssx";
import Post from "../interfaces/iPost";
import SendIcon from '@mui/icons-material/Send';

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
    <div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            onChange={(e) => setText(e.target.value)}
            error={text.length > 140}
            id="outlined-multiline-flexible"
            label="create a post"
            multiline
            maxRows={4}
            variant="filled"
            style={{ width: "30rem", backgroundColor: 'white', marginRight: '0.2rem' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton style={{ background: "transparent", marginRight: '-2rem', marginBottom: '2rem' }} type="submit" disabled={text.length > 140}>
                    <SendIcon className="sendIcon" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <span style={{ marginLeft: '27rem', marginTop: '.4rem' }}>{text.length}/140</span>
        </div>
      </form>
    </div>
  );
}

export default NewPost;
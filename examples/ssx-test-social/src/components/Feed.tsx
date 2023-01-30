import { List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { useContext } from 'react';
import PostContextProps from '../interfaces/iPostContext';
import { makeStyles } from '@material-ui/core/styles';



function Feed({postContext}: { postContext: React.Context<PostContextProps>}) {
  const { posts } = useContext(postContext);

  return (
    <List>
      {posts.map((post) => (
        <ListItem>
          <ListItemText
            primary={post.user}
            secondary={
              <Typography variant="body2" color="textSecondary">
                {post.text}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}

export default Feed;


import { Card, CardContent, Typography } from '@material-ui/core';
import Post from '../interfaces/iPost';

const SinglePost = (post: Post) => {

return (
    <Card style={{display: 'flex', flexDirection: 'column', marginBottom: '1rem', width: '30rem'}}>
      <CardContent style={{display: 'flex', justifyContent: 'flex-start', marginBottom: '-1.5rem'}}>
        <Typography variant="subtitle2" style={{fontWeight: 'bold'}}>{post.user}</Typography>
      </CardContent>
      <CardContent>
        <Typography variant="body1" align="left">{post.postText}</Typography>
      </CardContent>
    </Card>
  );
};

export default SinglePost;
import Post from '../interfaces/iPost'

const Feed = (props: any) => {
    console.log("in feed")
    console.log(props.posts)
    return (
        <div>
        {props.posts.map((post: Post, index: any) => (
          <div key={index}>{post.text}{post.user}</div>
        ))}
      </div>
    )
}

export default Feed;
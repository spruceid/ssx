import { Key, useState } from "react";

const NewPost = (props: any) => {
    const [text, setText] = useState('');

    interface Post {
        text: string,
        user: string
    }

    function handleChange(event: any) {
        setText(event.target.value);
    }

    function handleSubmit(event: any) {
        event.preventDefault();
        props.setPosts([...props.posts, {text: text, user: props.ssxProvider.address()}]);
        setText('');
    }

    return (
        <>
          <form onSubmit={handleSubmit}>
            <input type="text" value={text} onChange={handleChange} />
            <button type="submit">Post</button>
          </form>
          <div>
            {props.posts.map((post: Post, index: any) => (
              <div key={index}>{post.text}{post.user}</div>
            ))}
          </div>
        </>
      );

}

export default NewPost;
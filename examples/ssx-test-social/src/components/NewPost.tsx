import { useState } from "react";
import Post from '../interfaces/iPost'

const NewPost = (props: any) => {
    const [text, setText] = useState('');

    function handleChange(event: any) {
        setText(event.target.value);
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const tx = await props.contract.addPost(text)
        await tx.wait();
        props.setPosts([...props.posts, {text: text, user: props.ssxProvider.address()}]);
        setText('');
    }

    return (
        <>
          <form onSubmit={handleSubmit}>
            <input type="text" value={text} onChange={handleChange} />
            <button type="submit">Post</button>
          </form>
        </>
      );

}

export default NewPost;
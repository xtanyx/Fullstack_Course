import { useState } from "react";
import Styles from '../componentStyles'

const CreateBlog = ({ createBlog, setVisible }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleCreateBlog = (event) => {
    event.preventDefault();
    const blog = {
      title: title,
      author: author,
      url: url,
    };

    createBlog(blog);
    setTitle("");
    setAuthor("");
    setUrl("");
    setVisible(false);
  };

  return (
    <form onSubmit={handleCreateBlog}>
      <div>
        <Styles.Label htmlFor="title">title:</Styles.Label>
        <Styles.Input
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          id="title"
        ></Styles.Input>
      </div>
      <div>
        <Styles.Label htmlFor="author">author:</Styles.Label>
        <Styles.Input
          type="text"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          id="author"
        ></Styles.Input>
      </div>
      <div>
        <Styles.Label htmlFor="url">url:</Styles.Label>
        <Styles.Input
          type="text"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          id="url"
        ></Styles.Input>
      </div>
      <Styles.Button type="submit">create</Styles.Button>
    </form>
  );
};

export default CreateBlog;

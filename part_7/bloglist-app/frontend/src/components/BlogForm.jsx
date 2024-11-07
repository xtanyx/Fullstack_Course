import CreateBlog from "./CreateBlog";
import Notification from "./Notification";
import { useState } from "react";
import DisplayBlog from "./DisplayBlog";
import Styles from '../componentStyles'

const BlogForm = ({
  message,
  blogs,
  user,
  handleLogout,
  createBlog,
  likeBlog,
  removeBlog,
}) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  return (
    <div>
      <Notification message={message} />
      <div style={hideWhenVisible}>
        <Styles.Button onClick={() => setVisible(true)}>create new blog</Styles.Button>
      </div>
      <div style={showWhenVisible}>
        <CreateBlog createBlog={createBlog} setVisible={setVisible} />
        <Styles.Button onClick={() => setVisible(false)}>cancel</Styles.Button>
      </div>
      <div data-testid="displayBlog">
        {blogs.map((blog) => (
          <DisplayBlog
            blog={blog}
            key={blog.id}
            likeBlog={likeBlog}
            user={user}
            removeBlog={removeBlog}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogForm;

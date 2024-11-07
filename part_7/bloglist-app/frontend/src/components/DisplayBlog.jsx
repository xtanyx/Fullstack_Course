import { useState } from "react";
import { Link } from "react-router-dom";
import Styles from '../componentStyles'

const DisplayBlog = ({ blog, likeBlog, user, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  
  return (
    <div style={blogStyle}>
      <div className="blogHidden">
        <Styles.StyledLink to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Styles.StyledLink>
      </div>
    </div>
  );
};

export default DisplayBlog;

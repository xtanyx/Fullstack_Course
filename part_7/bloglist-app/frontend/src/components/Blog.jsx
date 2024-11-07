import { useParams } from "react-router-dom"
import Comments from "../components/Comments"
import Styles from '../componentStyles'

const Blog = ({blogs, likeBlog, removeBlog, user, addComment}) => {
  const id = useParams().id
  const blog = blogs.find(ablog => ablog.id === id)

  if(!blog) {
    return null
  }

  const handleOnLike = () => {
    const likedBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    };

    likeBlog(likedBlog);
  };


  return (
    <div>
        <h2>{blog.title}</h2>
        <div>
          <a href={blog.url}>{blog.url}</a> <br></br>
          <div>
            {blog.likes} likes 
            <Styles.Button onClick={handleOnLike}>like</Styles.Button>
          </div>
          <div>
            added by {blog.user.name} <br></br>
            {user.username === blog.user.username ? (
              <Styles.Button onClick={() => removeBlog(blog)}>remove</Styles.Button>
            ) : null}
            <Comments blog={blog} addComment={addComment}/>
          </div>
        </div>
      </div>
  )
}

export default Blog
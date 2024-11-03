import { useState } from 'react'

const DisplayBlog = ({ blog, likeBlog, user, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const handleOnLike = () => {
    const likedBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1
    }

    likeBlog(likedBlog)
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible} className='blogHidden'>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(true)}>view</button>
      </div>
      <div style={showWhenVisible} className='blogVisible'>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(false)}>hide</button>
        <div>
          {blog.url} <br></br>
          <div>
            likes {blog.likes}
            <button onClick={handleOnLike}>like</button>
          </div>
          <div>
            {blog.user.name} <br></br>
            {
              user.username === blog.user.username
                ? <button onClick={() => removeBlog(blog)}>remove</button>
                : null
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default DisplayBlog
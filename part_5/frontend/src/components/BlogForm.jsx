import CreateBlog from './CreateBlog'
import Notification from './Notification'
import { useState } from 'react'
import DisplayBlog from './DisplayBlog'

const BlogForm = ({ message, blogs, user, handleLogout, createBlog, likeBlog, removeBlog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message}/>
      <p>
        {user.name} logged in {' '}
        <button onClick={handleLogout}>logout</button>
      </p>
      <div style={hideWhenVisible}>
        <button onClick={() => setVisible(true)}>create new blog</button>
      </div>
      <div style={showWhenVisible}>
        <CreateBlog createBlog={createBlog} setVisible={setVisible}/>
        <button onClick={() => setVisible(false)}>cancel</button>
      </div>
      <div data-testid='displayBlog'>
        {blogs.map(blog => <DisplayBlog blog={blog} key={blog.id} likeBlog={likeBlog} user={user} removeBlog={removeBlog}/>)}
      </div>
    </div>
  )
}

export default BlogForm
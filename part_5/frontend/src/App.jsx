import { useState, useEffect } from 'react'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const compareFn = (a, b) => {
    if (a.likes > b.likes) {
      return -1
    } else if (a.likes < b.likes) {
      return 1
    }

    return 0
  }

  useEffect(() => {
    blogService.getAll()
      .then(blogs => blogs.sort(compareFn))
      .then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)

      setNotification('Login Successful')
      setTimeout(() => {
        setNotification(null)
      }, 3000)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification('Invalid username/password')
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    setNotification('Logged Out!')
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const createBlog = async (blog) => {
    try {
      const createdBlog = await blogService.create(blog)
      console.log(createdBlog)
      setBlogs(blogs.concat(createdBlog))
      setNotification(`Blog ${createdBlog.title} by ${createdBlog.author} created!`)
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    } catch (exception) {
      setNotification('Blog title/url missing')
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  const likeBlog = async (blog) => {
    try {
      const likedBlog = await blogService.like(blog)
      const updatedBlogs = blogs.filter((oldBlog) => oldBlog.id !== blog.id).concat(likedBlog).sort(compareFn)
      setBlogs(updatedBlogs)
      setNotification(`Blog ${blog.title} by ${blog.author} liked!`)
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    } catch (exception) {
      setNotification('Unexpected error')
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  const removeBlog = async (blog) => {
    const toRemove = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (toRemove) {
      try {
        await blogService.remove(blog)
        setBlogs(blogs.filter((oldblog) => oldblog.id !== blog.id))
      } catch(exception) {
        setNotification('Unexpected error')
        setTimeout(() => {
          setNotification(null)
        }, 3000)
      }
    }
  }

  return (
    <div>
      {
        user === null
          ? <LoginForm
            message={notification}
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
          : <BlogForm
            message={notification}
            blogs={blogs}
            user={user}
            handleLogout={handleLogout}
            createBlog={createBlog}
            likeBlog={likeBlog}
            removeBlog={removeBlog}
          />
      }
    </div>
  )
}

export default App
import { useState } from 'react'

const CreateBlog = ({ createBlog, setVisible }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreateBlog = (event) => {
    event.preventDefault()
    const blog = {
      title: title,
      author: author,
      url: url
    }

    createBlog(blog)
    setTitle('')
    setAuthor('')
    setUrl('')
    setVisible(false)
  }

  return (
    <form onSubmit={handleCreateBlog}>
      <div>
        <label htmlFor="title">title:</label>
        <input type="text" value={title} onChange={({ target }) => setTitle(target.value)} id="title"></input>
      </div>
      <div>
        <label htmlFor="author">author:</label>
        <input type="text" value={author} onChange={({ target }) => setAuthor(target.value)} id="author"></input>
      </div>
      <div>
        <label htmlFor="url">url:</label>
        <input type="text" value={url} onChange={({ target }) => setUrl(target.value)} id="url"></input>
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default CreateBlog
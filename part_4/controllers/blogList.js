const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const midddleware = require('../utils/middleware')

blogRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})

blogRouter.put('/:id', async(request, response) => {
  const blog = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
  response.json(updatedBlog)
})

blogRouter.post('/', midddleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (body.title === undefined || body.url === undefined) {
    return response.status(400).end()
  }

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes === undefined ? 0 : request.body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', midddleware.userExtractor, async(request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(204).end()
  }
  else if (user._id.toString() !== blog.user.toString()) {
    return response.status(401).json({error: 'No permission to delete blog'})
  }

  await Blog.findByIdAndDelete(request.params.id) 
  response.status(204).end()
})

module.exports = blogRouter
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  if (!user) {
    logger.info('Could not find user in database')
    return response.status(401).json({ error: 'token invalid' })
  }
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    logger.info('Could not find blog in database')
    return response.status(204).end()
  } 

  if (blog.user.toString() === user.id.toString()) {
    await Blog.deleteOne(blog)
    user.blogs = user.blogs.filter(b => !(b.id.toString() === blog.id.toString()))
    await user.save()
  }

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  console.log(body)
  updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, { new: true })
  console.log(updatedBlog)
  response.json(updatedBlog)
})

module.exports = blogsRouter
const Blog = require('../models/blog')

const initialBlogs = [
  {
    "title": "First blog",
    "author": "Dr. Bel",
    "url": "sample",
    "likes": 1
  },
  {
    "title": "Second blog",
    "author": "Dr. Bel",
    "url": "sample 2",
    "likes": 25
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = { initialBlogs, blogsInDb }
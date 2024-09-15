const Blog = require('../models/blog')
const User = require('../models/user')

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
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = { initialBlogs, blogsInDb, usersInDb }
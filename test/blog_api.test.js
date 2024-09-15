const { test, after, beforeEach, describe } = require('node:test')
const Blog = require('../models/blog')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blog posts', async () => {
  const blogs = await helper.blogsInDb()
  assert.strictEqual(blogs.length, helper.initialBlogs.length)
})

test('blog has property named id', async () => {
  const blogs = await helper.blogsInDb()
  const firstBlog = blogs[0]
  assert(Object.keys(firstBlog).includes('id'))
})

test('can create post', async () => {
  const newBlog = {
    "title": "new blog",
    "author": "Dr. Bel",
    "url": "new url",
    "likes": 252
  }
  await api.post('/api/blogs')
  .send(newBlog)
  
  const blogs = await helper.blogsInDb()
  assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
  const titles = blogs.map(b => b.title)
  assert(titles.includes(newBlog.title))
})

test('likes default to 0 if missing', async () => {
  const newBlog = {
    "title": "new blog2",
    "author": "Dr. Bel",
    "url": "new url2"
  }
  await api.post('/api/blogs')
  .send(newBlog)
  
  const blogs = await helper.blogsInDb()
  assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
  const savedBlog = blogs.find(blog => blog.title === newBlog.title)
  assert.strictEqual(savedBlog.likes, 0)
})


test('blog without title is not added', async () => {
  const newBlog = {
    "author": "Dr. Bel",
    "url": "new url2"
  }
  await api.post('/api/blogs')
  .send(newBlog)
  .expect(400)
  
  const blogs = await helper.blogsInDb()
  assert.strictEqual(blogs.length, helper.initialBlogs.length)
})

test('blog without author is not added', async () => {
  const newBlog = {
    "title": "new blog",
    "url": "new url2"
  }
  await api.post('/api/blogs')
  .send(newBlog)
  .expect(400)
  
  const blogs = await helper.blogsInDb()
  assert.strictEqual(blogs.length, helper.initialBlogs.length)
})


test('delete blog post', async () => {
  
  const blogs = await helper.blogsInDb()
  const firstBlog = blogs[0]
  await api.delete(`/api/blogs/${firstBlog.id}`)
  .expect(204)
  
  const updatedBlogs = await helper.blogsInDb()
  assert.strictEqual(updatedBlogs.length, helper.initialBlogs.length - 1)
})

test('update blog post', async () => {
  
  const blogs = await helper.blogsInDb()
  const firstBlog = blogs[0]
  firstBlog.author = "Mell"
  await api.put(`/api/blogs/${firstBlog.id}`)
  .send({author: "Mell"})
  .expect(200)
  
  const updatedBlogs = await helper.blogsInDb()
  const newFirstBlog = updatedBlogs[0]
  assert.deepStrictEqual(firstBlog, newFirstBlog)
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
})


after(async () => {
  await mongoose.connection.close()
})

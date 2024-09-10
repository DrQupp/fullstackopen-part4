const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) =>{
  const reducer = (maxLikeBlog, newBlog) => {
    console.log(maxLikeBlog)
    console.log(newBlog)
    return maxLikeBlog.likes > newBlog.likes ? maxLikeBlog : newBlog
  }
  const r = blogs.reduce(reducer)
  return {
    title: r.title,
    author: r.author,
    likes: r.likes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
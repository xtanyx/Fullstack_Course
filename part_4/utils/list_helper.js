const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]


const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (likes, blog) => {
    return likes + blog.likes
  }

  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (curFavBlog, blog) => {
    if (curFavBlog.likes <= blog.likes) {
      return {
        title: blog.title,
        author: blog.author,
        likes: blog.likes
      }
    }
    else {
      return curFavBlog
    }
  }

  return blogs.length === 0
    ? null 
    : blogs.reduce(reducer, {title: blogs[0].title, author: blogs[0].author, likes: blogs[0].likes})
}

const mostBlogs = (blogs) => {
  const reduced_to_authors = blogs.reduce((authors, blog) => {
    const exists = authors.find((author) => author.author === blog.author)
    if (exists) {
      return authors.filter((author) => author.author !== exists.author).concat({author: exists.author, blogs: exists.blogs+1})
    }
    else {
      return authors.concat({author: blog.author, blogs: 1})
    }
  }, [])

  return blogs.length > 0 
    ? reduced_to_authors.reduce((authorToReturn, author) => {
        return authorToReturn.blogs > author.blogs ? authorToReturn : author
      }, {})
    : null
}

const mostLikes = (blogs) => {
  const reduced_to_authors = blogs.reduce((authors, blog) => {
    const exists = authors.find((author) => author.author === blog.author)
    if (exists) {
      return authors.filter((author) => author.author !== exists.author).concat({author: exists.author, likes: (exists.likes + blog.likes)})
    }
    else {
      return authors.concat({author: blog.author, likes: blog.likes})
    }
  }, [])

  return blogs.length > 0 
    ? reduced_to_authors.reduce((author_with_more_likes, author) => {
        return author_with_more_likes.likes > author.likes ? author_with_more_likes : author
      }, {})
    : null
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
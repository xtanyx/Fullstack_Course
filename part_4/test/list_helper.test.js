const {test, describe, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

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

const rootUser = [{
  username: 'root',
  name: 'superuser',
  password: 'salainen'
}]

const freeToUse = {}

//BLOG TESTS
describe.only('Blog tests', () => {
  test.only('the blogs are returned as JSON', async() => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type',/application\/json/)
  })
  
  test.only('there are 1 blog posts', async() => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 1)
  })
  
  test.only('unique identifier property is called id', async() => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    assert(Object.keys(blog).includes('id'))
  })
  
  test.only('HTTP POST successfully creates a new blog post if token is valid', async() => {
    const newBlog = {
      title: 'new test blog',
      author: 'John Doe',
      url: 'http://non_existant_domain.com',
      likes: 7,
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${freeToUse.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type',/application\/json/)
  
    const response = await api.get('/api/blogs')
  
    const titles = response.body.map(r => r.title)
  
    assert.strictEqual(response.body.length, listWithOneBlog.length + 1)
  
    assert(titles.includes('new test blog'))
  })
  
  test.only('if the likes property is missing, likes is set to 0', async() => {
    const blogWithLikesMissing = {
      title: 'A blog with likes missing',
      author: 'John Doe',
      url: 'https://blogwlikesmissing.com'
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${freeToUse.token}`)
      .send(blogWithLikesMissing)
      .expect(201)
      .expect('Content-Type',/application\/json/)
  
    const response = await api.get('/api/blogs')
    const requiredBlog = response.body.find((blog) => blog.title === 'A blog with likes missing')
    assert.strictEqual(requiredBlog.likes, 0)
  })
  
  test.only('if title is missing, status code is 400', async() => {
    const blogWithTitleMissing = {
      author: 'John Doe',
      url: 'http://blogwtitlemissing.com',
      likes: 5
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${freeToUse.token}`)
      .send(blogWithTitleMissing)
      .expect(400)
  
    const response = await api.get('/api/blogs')
    assert.strictEqual(listWithOneBlog.length, response.body.length)
  })
  
  test.only('if url is missing, status code is 400', async() => {
    const blogWithUrlMissing = {
      title: 'Blog with url missing',
      author: 'John Doe',
      likes: 6
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${freeToUse.token}`)
      .send(blogWithUrlMissing)
      .expect(400)
  
    const response = await api.get('/api/blogs')
    assert.strictEqual(listWithOneBlog.length, response.body.length)
  })
  
  test.only('deletion succeeds with status code 204 if id is valid', async() => {
    await api
      .delete(`/api/blogs/${listWithOneBlog[0]._id}`)
      .set('Authorization', `Bearer ${freeToUse.token}`)
      .expect(204)
  
    const remainingBlogs = await api.get('/api/blogs')
    assert.strictEqual(remainingBlogs.body.length, listWithOneBlog.length - 1)
  })
  
  test.only('updating a blog succeeds if id is valid', async() => {
    const blogUpdate = {
      id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 15,
    }
  
    const response = await api
      .put(`/api/blogs/${listWithOneBlog[0]._id}`)
      .send(blogUpdate)
      .expect(200)

    blogUpdate.user = freeToUse.user
  
    assert.deepStrictEqual(response.body, blogUpdate)
  })

  test.only('adding a blog fails if token is not provided', async() => {
    const newBlog = {
      title: 'new test blog',
      author: 'John Doe',
      url: 'http://non_existant_domain.com',
      likes: 7,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
  
  beforeEach(async() => {
    await User.deleteMany({})
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(rootUser[0].password, saltRounds)

    let user = new User({
      username: rootUser[0].username,
      name: rootUser[0].name,
      passwordHash: passwordHash 
    })

    let returnedUser = await user.save()

    freeToUse.token = (await api
     .post('/api/login')
     .send({username: rootUser[0].username, password: rootUser[0].password})).body.token

    freeToUse.user = returnedUser._id.toString()

    await Blog.deleteMany({})
    let blog = new Blog(listWithOneBlog[0])
    blog.user = returnedUser._id
    await blog.save()
  })
})

//USER TESTS
describe.only('User tests', () => {

  test.only('test succeeds when username and password are valid', async() => {
    const validUser = {
      username: 'jdoe',
      name: 'John Doe',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(validUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test.only('when username is missing, return error 400', async() => {
    const invalidUser = {
      name: 'John Doe',
      password: 'salainen'
    }

    const response = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)

    assert(response.body.error.includes('Path `username` is required'))

    const result = await api.get('/api/users')
    assert.strictEqual(result.body.length, rootUser.length)
  })

  test.only('when username is lesser than 3 characters, return error 400', async() => {
    const invalidUser = {
      username: 'jd',
      name: 'John Doe',
      password: 'salainen'
    }

    const response = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)

    const errorMessage = response.body.error

    assert(errorMessage.includes('Path `username`') && errorMessage.includes('is shorter than the minimum allowed length'))

    const result = await api.get('/api/users')
    assert.strictEqual(result.body.length, rootUser.length)
  })

  test.only('when username already exists, return error 400', async() => {
    const invalidUser = {
      username: 'root',
      name: 'John Doe',
      password: 'salainen'
    }

    const response = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)

    assert.strictEqual(response.body.error, 'Username already exists')

    const result = await api.get('/api/users')
    assert.strictEqual(result.body.length, rootUser.length)
  })

  test.only('when password is missing, return error 400', async() => {
    const invalidUser = {
      username: 'jdoe',
      name: 'John Doe'
    }

    const response = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)

    assert.strictEqual(response.body.error, 'Password required')

    const result = await api.get('/api/users')
    assert.strictEqual(result.body.length, rootUser.length)
  })

  test.only('when password is less than 3 characters long, return error 400', async() => {
    const invalidUser = {
      username: 'jdoe',
      name: 'John Doe',
      password: 'sa'
    }

    const response = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)

    assert.strictEqual(response.body.error, 'Password must be atleast 3 characters long')

    const result = await api.get('/api/users')
    assert.strictEqual(result.body.length, rootUser.length)

  })

  beforeEach(async() => {
    await User.deleteMany({})
    let user = new User(rootUser[0])
    await user.save()
  })
})

after(async() => {
  await mongoose.connection.close()
})

//Other tests

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test("of empty list is zero", () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when there are many blogs is calculated correctly', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })
})

describe("favorite blog", () => {
  test("when list is empty", () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, {
      title: 'Go To Statement Considered Harmful', 
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('when there are many blogs is calculated correctly', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    })
  })
})

describe("most blogs", () => {
  test("when list is empty, is equal to null", () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, equals the author of that', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      blogs: 2
    })
  })

  test("when list has many blogs, is the author with most number of blogs", () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3
    })
  })
})

describe("most likes", () => {
  test("when list is empty, is equal to null", () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, equals the author of that', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test("when list has many blogs, is the author with most number of likes", () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17
    })
  })
})
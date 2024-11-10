const {GraphQLError, subscribe} = require('graphql')
const Book  = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
// const loaders = require('./loaders')
const {PubSub} = require('graphql-subscriptions')
const pubsub = new PubSub()
require('dotenv').config()

const resolvers = {
  Query: {
    bookCount: async() => await Book.find({}).length,
    authorCount: async() => await Author.find({}).length,
    allBooks: async (root, args) => {
      const allBooks = await Book.find({}).populate('author', {name: 1, born: 1})
      if(!args.author && !args.genre){
        return allBooks
      }
      else if(!args.author){
        console.log('works...')
        return await Book.find({genres: args.genre}).populate('author',{name: 1, born: 1})
      }
      else if(!args.genre){
        return allBooks.filter(book => book.author.name === args.author)
      }

      return (await Book
        .find({genres: args.genre})
        .populate('author', {name: 1, born: 1}))
        .filter(book => book.author.name === args.author)
    },
    allAuthors: async() => {
      const authors = await Author.find({})
      console.log(authors)
      return authors
    },
    me: (root, args, context) => {
      return context.currentUser
    },
    booksByGenre: async (root, args) => {
      if (args.genre === 'all genres'){
        return await Book.find({}).populate('author',{name:1})
      }
      const books = await Book.find({genres: args.genre}).populate('author',{name: 1})
      return books
    }
  },

  Author: {
    bookCount: (root) => {
      return root.books.length
    }
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if(!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      let authorExists = (await Author.find({})).find(author => author.name === args.author)
      if (!authorExists) {
        const author = new Author({
          name: args.author,
          books: [args.title]
        })
        try{
          authorExists = await author.save()
        } catch (error) {
          throw new GraphQLError('Saving User failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }
      else {
        authorExists.books = authorExists.books.concat(args.title)
        try {
          await authorExists.save()
        } catch(error) {
          throw new GraphQLError('Saving User failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }
      console.log('bp1')
      const book = new Book({...args, author: authorExists})
      try {
        const savedBook = await book.save()
        pubsub.publish('BOOK_ADDED', {bookAdded: savedBook})
        
        return savedBook
      } catch (error) {
        throw new GraphQLError('Saving Book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if(!currentUser){
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const author = await Author.findOne({name: args.name})
      if (!author) {
        return null
      }
      
      author.born = args.setBornTo
      try{
        author.save()
      } catch (error) {
        throw new GraphQLError('Saving Author failed', {
          extensions: {
            code: 'BAD_USER_INPuT',
            invalidArgs: args.name,
            error
          }
        })
      }
      return author
    },
    createUser: async(root, args) => {
      const user = new User({...args})

      try{
        return user.save()
      } catch(error) {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      }
    },
    login: async(root, args) => {
      const user = await User.findOne({username: args.username})

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return {value: jwt.sign(userForToken, process.env.SECRET)}
    }
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers
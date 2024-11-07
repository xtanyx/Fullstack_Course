const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const errorHandler = (error, request, response, next) => {
  logger.error(error.name)
  if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }
  else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({error: 'Username already exists'})
  }
  else if (error.name === 'CastError') {
    return response.status(400).json({error: 'malformmed id'})
  }
  else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({error: 'token invalid'})
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ','')
  }

  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if(!decodedToken.id) {
    return response.status(401).json({error: 'token invalid'})
  }

  request.user = await  User.findById(decodedToken.id)

  next()
}

module.exports = {
  errorHandler, tokenExtractor, userExtractor
}
const User = require('../models/user')
const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async(request, response) => {
  const {username, password} = request.body

  const findUser = await User.findOne({username})
  const passwordCorrect = findUser === null 
    ? false
    : await bcrypt.compare(password, findUser.passwordHash)

  if (!(findUser && passwordCorrect)) {
    return response.status(401).json({error: 'invalid username or password'})
  }

  const userForToken = {
    username: findUser.username,
    id: findUser._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response.status(200).send({token, username: findUser.username, name: findUser.name})
})

module.exports = loginRouter
const User = require('../models/user')
const userRouter = require('express').Router()
const bcrypt = require('bcrypt')

userRouter.post('/', async (request, response) => {

  const password = request.body.password
  if (password === undefined) {
    return response.status(400).send({error: 'Password required'})
  }
  else if (password.length < 3) {
    return response.status(400).send({error: 'Password must be atleast 3 characters long'})
  }
  
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username: request.body.username,
    name: request.body.name,
    passwordHash: passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

userRouter.get('/', async (request, response) => {
  const allUsers = await User.find({}).populate('blogs', {title: 1, author: 1, url: 1})
  response.json(allUsers)
})

module.exports = userRouter
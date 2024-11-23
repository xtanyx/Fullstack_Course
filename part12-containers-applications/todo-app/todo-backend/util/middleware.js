const redis = require('../redis')
const {Todo} = require('../mongo')

const setup_redis = async (req, res, next) => {
  const added_todos = await Todo.find({})
  await redis.setAsync("added_todos", Number(added_todos.length))

  next()
}

module.exports = {
  setup_redis
}
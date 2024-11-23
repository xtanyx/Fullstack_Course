const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redis = require('../redis')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  console.log(todos)
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  console.log('works..')
  const current_todos = await redis.getAsync("added_todos")
  await redis.setAsync("added_todos", Number(current_todos)+1)
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo); // Implement this
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const new_todo = {
    _id: req.todo._id,
    text: req.body.text,
    done: req.body.done === 'false' ? false : true
  }
  const updated_todo = await Todo.findByIdAndUpdate(req.todo.id, new_todo, {new: true})
  res.send(updated_todo); // Implement this
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;

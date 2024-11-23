const express = require('express');
const router = express.Router();
const redis = require('../redis')

const configs = require('../util/config')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

router.get('/statistics', async (req, res) => {
  const current_todos = await redis.getAsync("added_todos")
  console.log(current_todos)
  res.json({"added_todos": current_todos ? Number(current_todos) : 0})
})

module.exports = router;

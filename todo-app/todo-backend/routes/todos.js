const express = require('express');
const { Todo } = require('../mongo')
const { get, set } = require('../redis')
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* GET statistics. */
router.get('/statistics', async (_, res) => {
  const added_todos = await get('added_todos') || 0
  res.send({ added_todos: Number(added_todos) })
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  const added_todos = await get('added_todos') || 0
  await set('added_todos', Number(added_todos) + 1)
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
    res.send(req.todo)
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { text, done } = req.body
  const updatedTodo = await Todo.findByIdAndUpdate(
    req.todo._id, 
    { text, done }, 
    { new: true, runValidators: true }
  )
  res.send(updatedTodo)
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;

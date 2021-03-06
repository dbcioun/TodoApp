const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("Hello world")
});

app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc)
  }).catch((e) => {
    res.status(400).send(e)
  })
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos})
  }).catch((e) => {
    res.status(400).send(e)
  })
});

app.get('/todos/:id', (req, res) => {
  let id = req.params.id

  if(!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findById(id).then((todo) => {
    if(!todo) {
      res.status(404).send()
    }
    res.send({todo})
  }).catch((e) => {
    res.status(400).send()
  });
});

app.delete('/todos/:id', (req, res) => {
  let id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo) {
      return res.status(404).send()
    }
    res.send(todo)
  }).catch((e) => {
    res.status(400).send()
  })
});

app.listen(port, () => console.log(`Running at port ${port}`));

module.exports = { app };

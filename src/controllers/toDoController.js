// const path = require('path');
//const ToDo = require(path.resolve(__dirname, '..', 'models', 'ToDo'));
const ToDo = require('../models/ToDo');

const toDoList = [];

const create = (req, res) => {
  const data = req.body;
  if (data.id && data.info) {
    let toDo = new ToDo(
      data.id,
      data.info,
      data.dueDate
    );
    toDoList.push(toDo);
    res.send(toDo);
  } else {
    res.status(400).send('Ta errado, amigo...');
  }
};

const readAll = (req, res) => {
  if (req.query.outdated) readOutdated(req, res);
  else res.send(JSON.stringify(toDoList));
};

const getById = (req, res) => {
  const id = req.query.id;
  const toDo = toDoList.filter(obj => `${obj.id}` === id);
  res.send(toDo);
};

const readOutdated = (req, res) => {
  const now = new Date().getTime();
  const outdated = [];
  toDoList.forEach(obj => {
    let date = new Date(obj.dueDate).getTime();
    if (date < now) outdated.push(obj);
  });
  res.send(outdated);
};

const markAsFinished = (req, res) => {
  const id = req.body.id;
  const found = toDoList.find(obj => obj.id === id);
  const ind = toDoList.indexOf(found);
  if (toDoList[ind]) {
    toDoList[ind].checkToDo();
    res.send('Checked');
  } else {
    res.status(404).send('Tem esse não...');
  }
};

const update = (req, res) => {
  const data = req.body;
  const id = data.id;
  const found = toDoList.find(obj => obj.id === id);
  const ind = toDoList.indexOf(found);
  toDoList[ind] = data;
  res.send('Updated');
};

const destroy = (req, res) => {
  const id = req.body.id;
  const found = toDoList.find(obj => obj.id === id);
  toDoList.splice(toDoList.indexOf(found));
  res.send('Deleted');
};

module.exports = {
  create,
  readAll,
  getById,
  readOutdated,
  markAsFinished,
  update,
  destroy
};
const express = require('express');
const router = express.Router();

const controller = require('../controllers/toDoController');
const v1 = '/api/v1/';

// List all toDo's.
router.get(v1, controller.readAll);
// Show toDo data by id.
router.get(`${v1}id/`, controller.getById);
// Create toDo.
router.post(`${v1}create`, controller.create);
// Mark toDo as finish.
router.put(`${v1}mark`, controller.markAsFinished);
// Update data of toDo.
router.put(`${v1}update`, controller.update);
// Delete toDo.
router.delete(`${v1}delete`, controller.destroy);

module.exports = router;
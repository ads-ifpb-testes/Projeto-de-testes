module.exports = class ToDo {

  constructor(id, info, dueDate) {
    this.id = id;
    this.info = info;
    this.dueDate = dueDate;
    this.check = false;
  }

  checkToDo() { this.check = !this.check; }
};
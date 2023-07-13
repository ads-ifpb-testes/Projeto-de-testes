const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user: { type: String, required: true },
  post: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now() }
});

const CommentModel = mongoose.model('Comment', CommentSchema);

class Comment {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.comment = null;
  }

  async create() {
    this.comment = await CommentModel.create(this.body);
  }

  static async readByUser(user) {
    if (typeof user !== 'string') return;
    const comments = await CommentModel.find({ user });
    return comments;
  }

  static async readByPost(post) {
    if (typeof post !== 'string') return;
    const comments = await CommentModel.find({ post });
    return comments;
  }

  static async delete(id) {
    if (typeof id !== 'string') return;
    const comment = await CommentModel.findByIdAndDelete(id);
    return comment;
  }

}

module.exports = {
  Comment,
  CommentModel
};
const path = require('path');
const Comment = require(path.resolve(__dirname,'..','models','CommentModel'));
const userController = require(path.resolve(__dirname, 'userController'));

const create = async (req, res) => {
  const c = new Comment(req.body);
  c.create();
  res.json(c.comment);
};

const readByPost = async (req, res) => {
  try {
    const post = req.params.post;
    const comments = await Comment.readByPost(post);
    let displayComments = [];

    for (let com of comments) {
      let user = await userController.getByIdInner(com.user);
      let content = com.content.replace(/\r?\n/g, '<br>').replace(/ /g, '&nbsp;');

      displayComments.push({
        _id: com._id,
        user,
        content,
        date: com.date,
      });
    }

    return res.json(displayComments);
  } catch (e) {
    console.log(e);
  }
};

const readByPostInner = async (post) => {
  try {
    const comments = await Comment.readByPost(post);
    let displayComments = [];

    for (let com of comments) {
      let user = await userController.getByIdInner(com.user);
      let content = com.content.replace(/\r?\n/g, '<br>').replace(/ /g, '&nbsp;');

      displayComments.push({
        _id: com._id,
        user,
        content,
        date: com.date,
      });
    }

    return displayComments;
  } catch (e) {
    console.log(e);
  }
};

const destroy = async (req, res) => {

};

const update = async (req, res) => {

};

module.exports = {
  create,
  destroy,
  readByPost,
  readByPostInner,
  update
};
const path = require('path');
const Comment = require(path.resolve(__dirname, '..', 'models', 'CommentModel'));
const userController = require(path.resolve(__dirname, 'userController'));

const create = async (req, res) => {
  const c = new Comment(req.body);
  c.create();
  res.redirect('back');
};

const readByPost = async (req, res) => {
  try {
    const post = req.params.post;
    const comments = await Comment.readByPost(post);
    let displayComments = await treatComments(comments);
    return res.send(displayComments);
  } catch (e) {
    console.log(e);
  }
};

const readByPostInner = async (post) => {
  try {
    const comments = await Comment.readByPost(post);
    let displayComments = await treatComments(comments);
    return displayComments;
  } catch (e) {
    console.log(e);
  }
};

const destroy = async (req, res) => {
  await Comment.delete(req.params.id);
  res.redirect('back');
};

const destroyInner = async (id) => {
  await Comment.delete(id);
};

const update = async (req, res) => {

};

const treatComments = async (comments) => {
  let displayComments = [];

  for (let com of comments) {
    let userData = await userController.getByIdInner(com.user);
    let content = com.content.replace(/\r?\n/g, '<br>').replace(/ /g, '&nbsp;');
    displayComments.push({
      _id: com._id,
      user: userData,
      content,
      date: com.date,
    });
  }

  return displayComments;
};

module.exports = {
  create,
  destroy,
  destroyInner,
  readByPost,
  readByPostInner,
  update
};
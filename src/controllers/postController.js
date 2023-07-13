const path = require('path');
const {Post, PostModel} = require(path.resolve(__dirname, '..', 'models', 'PostModel'));
const userController = require(path.resolve(__dirname, 'userController'));
const commentController = require(path.resolve(__dirname, 'commentController'));

const create = async (req, res) => {
  let p = new Post(req.body);
  await p.create();
  await userController.addScore(req.body.user, 10);
  req.session.user = await userController.getByIdInner(req.body.user);
  res.redirect('/');
};

const readAll = async (req, res) => {
  let posts = await Post.readAll();
  let displayPosts = await treatPosts(posts);
  return res.send(displayPosts);
};

const readAllInner = async () => {
  let posts = await Post.readAll();
  let displayPosts = await treatPosts(posts);

  return displayPosts;
};

const readByUser = async (req, res) => {
  let user = req.params.id;
  let posts = await Post.readByUser(user);
  let displayPosts = await treatPosts(posts);

  return res.send(displayPosts);
};

const destroy = async (req, res) => {
  await destroyComments(req.params.id);
  await Post.delete(req.params.id);
  res.redirect('back');
};

const destroyInner = async (id) => {
  await destroyComments(id);
  await Post.delete(id);
};

const destroyComments = async (post) => {
  let comments = await commentController.readByPostInner(post);
  if (comments.length > 0) for (com of comments) {
    let id = String(com._id).replace('new ObjectId(\"', '').replace('\")', '');
    await commentController.destroyInner(id);
  }
};

const readFilter = async (req, res) => {
  const posts = await Post.readFilter(req.params.text);
  let displayPosts = await treatPosts(posts);
  return res.send(displayPosts);
};

const treatPosts = async (posts) => {
  let displayPosts = [];

  for (let post of posts) {
    let userData = await userController.getByIdInner(post.user);
    let comments = await commentController.readByPostInner(post.id);

    displayPosts.push({
      _id: post._id,
      user: userData,
      title: post.title,
      content: post.content,
      date: post.date,
      comments
    });
  }

  return displayPosts;
};

module.exports = {
  create,
  readAll,
  readAllInner,
  readByUser,
  destroy,
  destroyInner,
  readFilter
};
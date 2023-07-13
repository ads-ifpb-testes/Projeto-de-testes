require('dotenv').config();
const path = require('path');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const {User,UserModel} = require(path.resolve(__dirname, '..', 'models', 'UserModel'));
const {Post, PostModel} = require(path.resolve(__dirname, '..', 'models', 'PostModel'));
const {Comment, CommentModel} = require(path.resolve(__dirname, '..', 'models', 'CommentModel'));

const create = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.register();
    if (user.errors.length > 0) {
      console.log(user.errors);
      req.flash('errors', user.errors);
      req.session.save(() => res.redirect('/signin'));
    } else {
      req.session.user = user.user;
      req.session.token = jwt.sign({id: user._id, nome: user.username}, secretKey);
      req.session.save(() => res.redirect('/'));
    }
    return;
  } catch (e) {
    console.log(e);
  }
};

const login = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.login();
    if (user.errors.length > 0) {
      console.log(user.errors);
      req.flash('errors', user.errors);
      req.session.save(() => res.redirect('/login'));
    } else {
      req.session.user = user.user;
      req.session.token = jwt.sign({id: user._id, nome: user.username}, secretKey);
      req.session.save(() => res.redirect('/'));
    }
    return;
  } catch (e) {
    console.log(e);
  }
};

const logout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};

const getById = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) throw new Error('Id not specified');
    const user = await User.readById(id);
    res.send(user);
  } catch (e) {
    console.log(e);
  }
};

const getByIdInner = async (id) => {
  return await User.readById(id);
};

const update = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) throw new Error('Id not specified');
    const user = new User(req.body);
    if (req.file) user.body.pfPicture = `/img/custom-pfp/${req.file.filename}`;
    await user.update(id);
    if (user.errors.length > 0) throw new Error('Could not update');

    req.session.user = user.user;
    return res.redirect(`/profile/${id}`);
  } catch (e) {
    console.log(e);
  }
};

const destroy = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) throw new Error('Id not specified');
    const user = await User.delete(id);

    let posts = await Post.readByUser(id);
    if (posts.length > 0) for (let post of posts) {
      const postId = String(post._id).replace('new ObjectId(\"', '').replace('\")', '');
      await destroyComments(postId);
      await Post.delete(postId);
    }

    let comments = await Comment.readByUser(id);
    if (comments.length > 0) for (let com of comments) {
      const comId = String(com._id).replace('new ObjectId(\"', '').replace('\")', '');
      await Comment.delete(comId);
    }

    return res.redirect('/login/logout');
  } catch (e) {
    console.log(e);
  }
};

const destroyComments = async (post) => {
  let comments = await Comment.readByPost(post);
  if (comments.length > 0) for (com of comments) {
    let id = String(com._id).replace('new ObjectId(\"', '').replace('\")', '');
    await Comment.delete(id);
  }
};

const readAll = async (req, res) => {
  const users = await User.readAll();
  res.send(users);
};

const readAllInner = async () => {
  return await User.readAll();
};

const addScore = async (user, score) => {
  await User.addScore(user, score);
  return;
};

module.exports = {
  create,
  readAll,
  readAllInner,
  login,
  logout,
  getById,
  getByIdInner,
  update,
  destroy,
  addScore
};
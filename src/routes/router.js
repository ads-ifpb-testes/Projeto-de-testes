const path = require('path');
const express = require('express');
const router = express.Router();
const userAPI = require(path.resolve(__dirname, 'userAPI'));
const postsAPI = require(path.resolve(__dirname, 'postsAPI'));
const commentsAPI = require(path.resolve(__dirname, 'commentsAPI'));
const homeController = require(path.resolve(__dirname, '..', 'controllers', 'homeController'));
const userController = require(path.resolve(__dirname, '..', 'controllers', 'userController'));
const postController = require(path.resolve(__dirname, '..', 'controllers', 'postController'));
const commentController = require(path.resolve(__dirname, '..', 'controllers', 'commentController'));
const TM = require(path.resolve(__dirname, '..', 'middlewares', 'tokenMiddleware'));
const multer = require(path.resolve(__dirname, '..', 'lib', 'multer'));

// API
router.use('/api/v1/user', TM.isAPIAuthenticated,userAPI);
router.use('/api/v1/post', TM.isAPIAuthenticated, postsAPI);
router.use('/api/v1/comment',TM.isAPIAuthenticated, commentsAPI);

// Users
router.post('/user/create', userController.create);
router.get('/user/readAll', userController.readAll);
router.get('/user/getById/:id', userController.getById);
router.post('/user/delete/:id', TM.isAuthenticated, userController.destroy);
router.post('/user/update/:id', TM.isAuthenticated,multer.parser.single('pf-picture'), userController.update);
router.post('/user/login', userController.login);
router.get('/login/logout', userController.logout);

// Posts
router.post('/post/create', TM.isAuthenticated, postController.create);
router.post('/post/delete/:id', TM.isAuthenticated, postController.destroy);
router.get('/post/readAll', postController.readAll);
router.get('/post/readByUser/:id', postController.readByUser);
router.get('/post/readFilter/:text', postController.readFilter);

// Comments
router.post('/comment/create', TM.isAuthenticated, commentController.create);
router.post('/comment/delete/:id', TM.isAuthenticated, commentController.destroy);
router.post('/comment/update/:id', TM.isAuthenticated, commentController.update);
router.get('/comment/readByPost/:id', commentController.readByPost);

// Pages
router.get('/', homeController.index);
router.post('/', homeController.index);
router.get('/profile/:id', homeController.profile);
router.get('/login', homeController.login);
router.get('/signin', homeController.signin);

module.exports = router;
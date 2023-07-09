/**
 * @swagger
 * tags:
 *  name: posts
 *  description: Operações relacionadas aos posts do forum
 * 
 * */
const path = require('path');
const express = require('express');
const router = express.Router();
const postController = require(path.resolve(__dirname, '..', 'controllers', 'postController'));

/**
 * @swagger
 * /api/v1/post/create:
 *  post:
 *    summary: Cria uma entidade post.
 *    tags: 
 *      - posts
 *    description: Cria um novo post
 */
router.post('/create', postController.create);

/**
 * @swagger
 * /api/v1/post/delete:
 *  delete:
 *    summary: Deleta uma entidade post.
 *    tags: 
 *      - posts
 *    description: Deleta um post
 */
router.delete('/delete/:id', postController.destroy);

/**
 * @swagger
 * /api/v1/post/readAll:
 * get:
 *    summary: Lista todas as entidades post.
 *    tags: 
 *      - posts
 *    description: Lista todos os posts
 */
router.get('/readAll', postController.readAll);

/**
 * @swagger
 * /api/v1/post/readByUser/{id}:
 * get:
 *    summary: Lista todas as entidades post usando um id.
 *    tags: 
 *      - posts
 *    description: Lista todos os posts de um usuário pelo o id
 */
router.get('/readByUser/:id', postController.readByUser);

module.exports = router;

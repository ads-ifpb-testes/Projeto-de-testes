/**
 * @swagger
 * tags:
 *  name: comments
 *  description: Operações relacionadas aos comentários do forum
 * 
 * */
const path = require('path');
const express = require('express');
const router = express.Router();
const commentController = require(path.resolve(__dirname, '..', 'controllers', 'commentController'));

/**
 * @swagger
 * /api/v1/comment/create:
 *  post:
 *    summary: Cria uma entidade comment.
 *    tags: 
 *      - comments
 *    description: Cria um novo comentário
 */
router.post('/create', commentController.create);

/**
 * @swagger
 * /api/v1/comment/delete:
 *  delete:
 *    summary: Deleta uma entidade comment.
 *    tags: 
 *      - comments
 *    description: Deleta um novo comentário
 */
router.delete('/delete/:id', commentController.destroy);

/**
 * @swagger
 * /api/v1/comment/update:
 *  put:
 *    summary: Atualiza uma entidade comment.
 *    tags: 
 *      - comments
 *    description: Atualiza um comentário
 */
router.put('/update/:id', commentController.update);

/**
 * @swagger
 * /api/v1/comment/readByPost/{id}:
 * get:
 *    summary: Lista todos os comentários usando um id.
 *    tags: 
 *      - comments
 *    description: Lista todos os comentários de um post pelo o id
 */
router.get('/readByPost/:id', commentController.readByPost);

module.exports = router;

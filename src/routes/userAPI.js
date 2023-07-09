/**
 * @swagger
 * tags:
 *  name: users
 *  description: Operações relacionadas a usuarios do forum
 * 
 * */
const path = require('path');
const express = require('express');
const router = express.Router();
const multer = require(path.resolve(__dirname, '..', 'lib', 'multer'));
const userController = require(path.resolve(__dirname, '..', 'controllers', 'userController'));

/**
 * @swagger
 * /api/v1/user/create:
 *  post:
 *    summary: Cria uma entidade usuario.
 *    tags: 
 *      - users
 *    description: Cria um novo usuario
 */
router.post('/create', userController.create);

/**
 * @swagger
 * /api/v1/user/readAll:
 *  get:
 *    summary: Retorna todos os usuarios os cadastrados.
 *    tags: 
 *      - users
 *    description: Faz uma lista dos usuarios
 */
router.get('/readAll', userController.readAll);

/**
 * @swagger
 * /api/v1/user/getById/:id:
 *  get:
 *    summary: Retorna um usuario pelo seu ID
 *    tags: 
 *      - users
 *    description: Retorna um unico usuario pelo seu ID
 */
router.get('/getById/:id', userController.getById);

/**
 * @swagger
 * /api/v1/user/delete/:id:
 *  delete:
 *    summary: Deletar usuario é apagar seu proprio perfil a partir do seu ID 
 *    tags: 
 *      - users
 *    description: Deletar seu usuario pelo ID
 */
router.delete('/user/delete/:id', userController.destroy);

/**
 * @swagger
 * /api/v1/user/update/:id:
 *  put:
 *    summary: Atualiza a foto do perfil do Usuario a partir do seu ID
 *    tags: 
 *      - users
 *    description: Parte onde usuario pode atualizar sua foto de perfil
 */
router.put('/user/update/:id', multer.parser.single('pf-picture'), userController.update);

/**
 * @swagger
 * api/v1/user/login:
 *  post:
 *    summary: Local onde usuario ira logar seu perfil criado
 *    tags: 
 *      - users
 *    description: Usuario fazer login para entrar em sua conta do forum
 */
router.post('/user/login', userController.login);

/**
 * @swagger
 * api/v1/login/logout:
 *  get:
 *    summary: Parte para usuario sair do seu perfil
 *    tags: 
 *      - users
 *    description: Usuario sair da sua conta do forum
 */
router.get('/login/logout', userController.logout);

module.exports = router;

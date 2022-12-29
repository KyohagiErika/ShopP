import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import UserMiddleware from '../middlewares/user';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

/**
 * @swagger
 * /account/list-all:
 *  get:
 *   tags:
 *    - Account
 *   security:
 *    - bearerAuth: []
 *   summary: Get all users (ADMIN)
 *   description: Get all users (ADMIN)
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/UserListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/list-all',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  UserMiddleware.listAll
);

/**
 * @swagger
 * /account/own:
 *  get:
 *   tags:
 *    - Account
 *   security:
 *    - bearerAuth: []
 *   summary: Get own user information
 *   description: Get own user information
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/UserResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get('/own', AuthMiddleware.checkJwt, UserMiddleware.getOwn);

/**
 * @swagger
 * /account/sign-up:
 *  post:
 *   tags:
 *    - Account
 *   summary: Create a new user
 *   description: Create a new user
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/CreateNewUserRequest'
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 */
routes.post('/sign-up', UserMiddleware.postNew);

/**
 * @swagger
 * /account/sign-up-admin:
 *  post:
 *   tags:
 *    - Account
 *   summary: Create a new admin
 *   description: Create a new admin
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/CreateNewUserRequest'
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 */
routes.post('/sign-up-admin', UserMiddleware.postNewAdmin);

/**
 * @swagger
 * /account/edit:
 *  post:
 *   tags:
 *    - Account
 *   security:
 *    - bearerAuth: []
 *   summary: Edit one user
 *   description: Edit one user
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/EditUserRequest'
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post('/edit', AuthMiddleware.checkJwt, UserMiddleware.edit);

/**
 * @swagger
 * /account/delete:
 *  get:
 *   tags:
 *    - Account
 *   security:
 *    - bearerAuth: []
 *   summary: Delete one user
 *   description: Delete one user
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get('/delete', AuthMiddleware.checkJwt, UserMiddleware.delete);

/**
 * @swagger
 * /account/ban/{id}:
 *  get:
 *   tags:
 *    - Account
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the user
 *      example: 2
 *   summary: Ban user(ADMIN)
 *   description: Ban user(ADMIN)
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/ban/:id([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  UserMiddleware.ban
);

export default routes;

import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import { uploadImage } from '../middlewares/fileProvider';
import ShopMiddleware from '../middlewares/shop';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

/**
 * @swagger
 * /shop/list-all:
 *  get:
 *   tags:
 *    - Shop
 *   security:
 *    - bearerAuth: []
 *   summary: Get all shops (Admin)
 *   description: Get all shops (Admin)
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ShopListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/list-all',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  ShopMiddleware.listAll
);

/**
 * @swagger
 * /shop/get-shop/{id}:
 *  get:
 *   tags:
 *    - Shop
 *   security:
 *    - bearerAuth: []
 *   summary: Get one shop information
 *   description: Get one shop information
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *       format: uuid
 *       required: true
 *       description: id of the shop
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ShopResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get('/get-shop/:id', AuthMiddleware.checkJwt, ShopMiddleware.getOneById);

/**
 * @swagger
 * /shop/search-shop/{name}:
 *  get:
 *   tags:
 *    - Shop
 *   security:
 *    - bearerAuth: []
 *   summary: Search shops by Name
 *   description: Search shops by Name
 *   parameters:
 *    - in: path
 *      name: name
 *      schema:
 *       type: string
 *      required: true
 *      description: name of the shop
 *      example: 'hello'
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ShopListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/search-shop/:name',
  AuthMiddleware.checkJwt,
  ShopMiddleware.searchShop
);

/**
 * @swagger
 * /shop/new:
 *  post:
 *   tags:
 *    - Shop
 *   security:
 *    - bearerAuth: []
 *   summary: Create a new shop for user
 *   description: Create a new shop for user
 *   requestBody:
 *    content:
 *     multipart/form-data:
 *      schema:
 *       $ref: '#/components/schemas/ShopRequest'
 *      encoding:
 *       avatar:
 *        contentType: image/png, image/jpeg, image/jpg, image/gif
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/new',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  uploadImage('avatar'),
  ShopMiddleware.postNew
);

/**
 * @swagger
 * /shop/edit:
 *  post:
 *   tags:
 *    - Shop
 *   security:
 *    - bearerAuth: []
 *   summary: Edit user's shop
 *   description: Edit user's shop
 *   requestBody:
 *    content:
 *     multipart/form-data:
 *      schema:
 *       $ref: '#/components/schemas/ShopRequest'
 *      encoding:
 *       avatar:
 *        contentType: image/png, image/jpeg, image/jpg, image/gif
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/edit',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  uploadImage('avatar'),
  ShopMiddleware.edit
);

export default routes;

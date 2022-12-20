import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { RoleEnum } from '../utils/shopp.enum';
import CustomerMiddleware from '../middlewares/customer';
import { checkRole } from '../middlewares/checkRole';
import { uploadImage } from '../middlewares/fileProvider';

const routes = Router();

/**
 * @swagger
 * /customer/list-all:
 *  get:
 *   tags:
 *    - Customer
 *   security:
 *    - bearerAuth: []
 *   summary: Get all customers (Admin)
 *   description: Get all customers (Admin)
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/CustomerListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/list-all',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  CustomerMiddleware.listAll
);

/**
 * @swagger
 * /customer/new:
 *  post:
 *   tags:
 *    - Customer
 *   security:
 *    - bearerAuth: []
 *   summary: Create a new customer for user
 *   description: Create a new customer for user
 *   requestBody:
 *    content:
 *     multipart/form-data:
 *      schema:
 *       $ref: '#/components/schemas/CustomerRequest'
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
  AuthMiddleware.checkJwt,
  uploadImage('avatar'),
  CustomerMiddleware.postNew
);

/**
 * @swagger
 * /customer/edit:
 *  post:
 *   tags:
 *    - Customer
 *   security:
 *    - bearerAuth: []
 *   summary: Edit user's customer
 *   description: Edit user's customer
 *   requestBody:
 *    content:
 *     multipart/form-data:
 *      schema:
 *       $ref: '#/components/schemas/CustomerRequest'
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
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  uploadImage('avatar'),
  CustomerMiddleware.edit
);

/**
 * @swagger
 * /customer/follow-shop/{shopId}:
 *  post:
 *   tags:
 *    - Customer
 *   security:
 *    - bearerAuth: []
 *   summary: Follow a shop
 *   description: Follow a shop
 *   parameters:
 *    - in: path
 *      name: shopId
 *      schema:
 *       type: string
 *       format: uuid
 *       required: true
 *       description: id of the shop
 *       example: 1fbe4ea5-a957-40bf-9d59-6f390aecaaa3
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/follow-shop/:shopId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  CustomerMiddleware.followShop
);

/**
 * @swagger
 * /customer/unfollow-shop/{shopId}:
 *  post:
 *   tags:
 *    - Customer
 *   security:
 *    - bearerAuth: []
 *   summary: Unfollow a shop
 *   description: Unfollow a shop
 *   parameters:
 *    - in: path
 *      name: shopId
 *      schema:
 *       type: string
 *       format: uuid
 *       required: true
 *       description: id of the shop
 *       example: 1fbe4ea5-a957-40bf-9d59-6f390aecaaa3
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/unfollow-shop/:shopId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  CustomerMiddleware.unfollowShop
);

/**
 * @swagger
 * /customer/show-followed-shops-list:
 *  get:
 *   tags:
 *    - Customer
 *   security:
 *    - bearerAuth: []
 *   summary: Get followed shops list
 *   description: Get followed shops list
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/FollowedShopsResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/show-followed-shops-list',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  CustomerMiddleware.showFollowedShopsList
);

/**
 * @swagger
 * /customer/{id}:
 *  get:
 *   tags:
 *    - Customer
 *   security:
 *    - bearerAuth: []
 *   summary: Get one customer information
 *   description: Get one customer information
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *       format: uuid
 *       required: true
 *       description: id of the customer
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/CustomerResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  CustomerMiddleware.getOneById
);

export default routes;

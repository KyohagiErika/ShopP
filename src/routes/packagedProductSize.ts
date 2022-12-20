import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import PackagedProductSize from '../middlewares/packagedProductSize';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

/**
 * @swagger
 * /packaged-product-size/list-all:
 *  get:
 *   tags:
 *    - Packaged product size
 *   security:
 *    - bearerAuth: []
 *   summary: List all Packaged product size
 *   description: List all Packaged product size
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/PackagedListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get('/list-all', [AuthMiddleware.checkJwt], PackagedProductSize.listAll);

/**
 * @swagger
 * /packaged-product-size/{id}:
 *  get:
 *   tags:
 *    - Packaged product size
 *   security:
 *    - bearerAuth: []
 *   summary: Get one Packaged product size
 *   description: Get one Packaged product size
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *       format: int32
 *      required: true
 *      description: id of the Packaged product size
 *      example: 1
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/PackagedResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get('/:id', AuthMiddleware.checkJwt, PackagedProductSize.getOneById);

/**
 * @swagger
 * /packaged-product-size/packaged-product/{id}:
 *  get:
 *   tags:
 *    - Packaged product size
 *   security:
 *    - bearerAuth: []
 *   summary: Get one product packaged
 *   description: Get one product packaged
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *       format: uuid
 *      required: true
 *      description: id of the product
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/PackagedListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/packaged-product/:id',
  AuthMiddleware.checkJwt,
  PackagedProductSize.getOneByProductId
);

/**
 * @swagger
 * /packaged-product-size/new/{id}:
 *  post:
 *   tags:
 *    - Packaged product size
 *   security:
 *    - bearerAuth: []
 *   summary: Create a new Packaged product size (Shop)
 *   description: Create a new Packaged product size (Shop)
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *       format: uuid
 *       required: true
 *       description: id of the product
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/PackagedRequest'
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 */
routes.post(
  '/new/:productId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  PackagedProductSize.postNew
);

/**
 * @swagger
 * /packaged-product-size/edit/{id}:
 *  post:
 *   tags:
 *    - Packaged product size
 *   security:
 *    - bearerAuth: []
 *   summary: Edit Packaged product size (Shop)
 *   description: Edit Packaged product size (Shop)
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *       format: int32
 *      required: true
 *      description: id of the Packaged product size
 *      example: 1
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/PackagedRequest'
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 */
routes.post(
  '/edit/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  PackagedProductSize.edit
);

export default routes;

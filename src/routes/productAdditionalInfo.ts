import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import ProductAdditionalInfo from '../middlewares/productAdditionalInfo';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

/**
 * @swagger
 * /product-additional-info/list-all:
 *  get:
 *   tags:
 *    - Product Additional Info
 *   summary: List all Product Additional Info
 *   description: List all Product Additional Info
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ProductAdditionalInfoListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 */
routes.get('/list-all', ProductAdditionalInfo.listAll);

/**
 * @swagger
 * /product-additional-info/{id}:
 *  get:
 *   tags:
 *    - Product Additional Info
 *   summary: Get one product information
 *   description: Get one product information
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *       format: int32
 *      required: true
 *      description: id of the product additional info
 *      example: 1
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ProductAdditionalInfoResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 */
routes.get('/:id([0-9]+)', ProductAdditionalInfo.getOneById);

/**
 * @swagger
 * /product-additional-info/product-information/{productId}:
 *  get:
 *   tags:
 *    - Product Additional Info
 *   summary: Get one product information
 *   description: Get one product information
 *   parameters:
 *    - in: path
 *      name: productId
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
 *        $ref: '#/components/schemas/ProductAdditionalInfoListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 */
routes.get(
  '/product-information/:productId',
  ProductAdditionalInfo.getOneByProductId
);

/**
 * @swagger
 * /product-additional-info/new/{productId}:
 *  post:
 *   tags:
 *    - Product Additional Info
 *   security:
 *    - bearerAuth: []
 *   summary: Create a new Product Additional Info (Shop)
 *   description: Create a new Product Additional Info (Shop)
 *   parameters:
 *    - in: path
 *      name: productId
 *      schema:
 *       type: string
 *       format: uuid
 *      required: true
 *      description: id of the product
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/ProductAdditionalInfoRequest'
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/new/:productId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ProductAdditionalInfo.postNew
);

/**
 * @swagger
 * /product-additional-info/edit/{id}:
 *  post:
 *   tags:
 *    - Product Additional Info
 *   security:
 *    - bearerAuth: []
 *   summary: Edit Product Additional Info (Shop)
 *   description: Edit Product Additional Info (Shop)
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *       format: int32
 *      required: true
 *      description: id of the product additional info
 *      example: 1
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/ProductAdditionalInfoRequest'
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/edit/:id([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ProductAdditionalInfo.edit
);

export default routes;

import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import { uploadMultipleImage } from '../middlewares/fileProvider';
import ProductMiddleware from '../middlewares/product';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

/**
 * @swagger
 * /product/list-all:
 *  get:
 *   tags:
 *    - Product
 *   summary: Get all products
 *   description: Get all products
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ProductListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 */
routes.get('/list-all', ProductMiddleware.listAll); //[checkJwt, checkRole(RoleEnum.ADMIN)],

/**
 * @swagger
 * /product/get-one-by-id/{id}:
 *  get:
 *   tags:
 *    - Product
 *   summary: Get one product
 *   description: Get one product
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
 *        $ref: '#/components/schemas/ProductResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 */
routes.get('/get-one-by-id/:id', ProductMiddleware.getOneById);

/**
 * @swagger
 * /product/search-by-name/{name}:
 *  get:
 *   tags:
 *    - Product
 *   summary: Search product by name
 *   description: Search product by name
 *   parameters:
 *    - in: path
 *      name: name
 *      schema:
 *       type: string
 *      required: true
 *      description: name of the product
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ProductListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 */
routes.get('/search-by-name/:name', ProductMiddleware.searchByName);

/**
 * @swagger
 * /product/search-by-category/{categoryId}:
 *  get:
 *   tags:
 *    - Product
 *   summary: Search product by categoryId
 *   description: Search product by categoryId
 *   parameters:
 *    - in: path
 *      name: categoryId
 *      schema:
 *       type: string
 *       required: true
 *       description: categoryId of the product
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ProductListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 */
routes.get(
  '/search-by-category/:categoryId([0-9]+)',
  ProductMiddleware.searchByCategory
);

/**
 * @swagger
 * /product/search-by-category-name/{name}:
 *  get:
 *   tags:
 *    - Product
 *   summary: Search product by category name
 *   description: Search product by category name
 *   parameters:
 *    - in: path
 *      name: name
 *      schema:
 *       type: string
 *       required: true
 *       description: category name of the product
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ProductListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 */
routes.get(
  '/search-by-category-name/:name',
  ProductMiddleware.searchByCategoryName
);

/**
 * @swagger
 * /product/search-by-shop/{shopId}:
 *  get:
 *   tags:
 *    - Product
 *   summary: Search product by shopId
 *   description: Search product by shopId
 *   parameters:
 *    - in: path
 *      name: shopId
 *      schema:
 *       type: string
 *       required: true
 *       description: shopId of the product
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ProductListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 */
routes.get('/search-by-shop/:shopId', ProductMiddleware.searchByShop);

/**
 * @swagger
 * /product/filter-by-price/{max}/{min}:
 *  get:
 *   tags:
 *    - Product
 *   summary: Filter product by price
 *   description: Filter product by price
 *   parameters:
 *    - in: path
 *      name: max
 *      schema:
 *       type: string
 *      required: true
 *      description: max price
 *    - in: path
 *      name: min
 *      schema:
 *       type: string
 *      required: true
 *      description: min price
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ProductListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 */
routes.get('/filter-by-price/:max/:min', ProductMiddleware.filterByPrice);

/**
 * @swagger
 * /product/filter-by-star/{max}/{min}:
 *  get:
 *   tags:
 *    - Product
 *   summary: Filter product by star
 *   description: Filter product by star
 *   parameters:
 *    - in: path
 *      name: max
 *      schema:
 *       type: string
 *      required: true
 *      description: max star
 *    - in: path
 *      name: min
 *      schema:
 *       type: string
 *      required: true
 *      description: min star
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ProductListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 */
routes.get('/filter-by-star/:max/:min', ProductMiddleware.filterByStar);

/**
 * @swagger
 * /product/new:
 *  post:
 *   tags:
 *    - Product
 *   security:
 *    - bearerAuth: []
 *   summary: Create a new product
 *   description: Create a new product
 *   requestBody:
 *    content:
 *     multipart/form-data:
 *      schema:
 *       $ref: '#/components/schemas/ProductRequest'
 *      encoding:
 *       productImages:
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
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  uploadMultipleImage('productImages'),
  ProductMiddleware.postNew
);

routes.post(
  '/edit/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ProductMiddleware.edit
);

routes.post(
  '/delete/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ProductMiddleware.delete
);
export default routes;

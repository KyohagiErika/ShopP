import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import CategoryMiddleware from '../middlewares/category';
import { checkRole } from '../middlewares/checkRole';
import { uploadImage } from '../middlewares/fileProvider';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

/**
 * @swagger
 * /category/list-all:
 *  get:
 *   tags:
 *    - Category
 *   summary: Get all categories
 *   description: Get all categories
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/CategoryListResponse'
 */
routes.get('/list-all', CategoryMiddleware.listAll);

/**
 * @swagger
 * /category/{id}:
 *  get:
 *   tags:
 *    - Category
 *   summary: Get one category
 *   description: Get one category
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *       format: int32
 *      required: true
 *      description: id of the category
 *      example: 1
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/CategoryResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 */
routes.get('/:id([0-9]+)', CategoryMiddleware.getOneById);

/**
 * @swagger
 * /category/new:
 *  post:
 *   tags:
 *    - Category
 *   security:
 *    - bearerAuth: []
 *   summary: Create a new category (ADMIN)
 *   description: Create a new category (ADMIN)
 *   requestBody:
 *    content:
 *     multipart/form-data:
 *      schema:
 *       $ref: '#/components/schemas/CategoryRequest'
 *      encoding:
 *       image:
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
  uploadImage('image'),
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  CategoryMiddleware.postNew
);

export default routes;

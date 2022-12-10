import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import ShoppingUnitMiddleware from '../middlewares/shoppingUnit';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

/**
 * @swagger
 * /shopping-unit/list-all:
 *  get:
 *   tags:
 *    - Shopping Unit
 *   summary: List all shopping unit (Customer)
 *   description: List all shopping unit (Customer)
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ShoppingUnitListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get('/list-all', ShoppingUnitMiddleware.listAll);

/**
 * @swagger
 * /shopping-unit/{id}:
 *  get:
 *   tags:
 *    - Shopping Unit
 *   summary: Get one shopping unit (Customer)
 *   description: Get one shopping unit (Customer)
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *       format: int32
 *      required: true
 *      description: id of the shopping unit
 *      example: 1
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *         $ref: '#/components/schemas/ShoppingUnitResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get('/:id([0-9]+)', ShoppingUnitMiddleware.getOneById);

/**
 * @swagger
 * /shopping-unit/new:
 *  post:
 *   tags:
 *    - Shopping Unit
 *   security:
 *    - bearerAuth: []
 *   summary: Create a new shopping unit (admin)
 *   description: Create a new shopping unit (admin)
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/ShoppingUnitRequest'
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
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  ShoppingUnitMiddleware.postNew
);

export default routes;

import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import CartMiddleware from '../middlewares/cart';
import { checkRole } from '../middlewares/checkRole';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

/**
 * @swagger
 * /cart:
 *  get:
 *   tags:
 *    - Cart
 *   security:
 *    - bearerAuth: []
 *   summary: Show cart
 *   description: Show cart
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/CartResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest' 
 */
routes.get(
  '/',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  CartMiddleware.showCart
);

/**
 * @swagger
 * /cart/update:
 *  post:
 *   tags:
 *    - Cart
 *   security:
 *    - bearerAuth: []
 *   summary: Update cart
 *   description: Update cart
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/CartRequest'
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/CartResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest' 
 */
routes.post(
  '/update',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  CartMiddleware.update
);

export default routes;

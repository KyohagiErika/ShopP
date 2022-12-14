import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import OrderProductMiddleware from '../middlewares/orderProduct';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();
/**
 * @swagger
 * /order-product/view-order-product/{id}:
 *  get:
 *   tags:
 *    - Order Product
 *   security:
 *    - bearerAuth: []
 *   summary: Get order product by id
 *   description: Get order product by id
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *       format: uuid
 *      required: true
 *      description: id of the order product
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/OrderProductResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/view-order-product/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  OrderProductMiddleware.viewOrderProduct
);

export default routes;

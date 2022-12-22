import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import OrderMiddleware from '../middlewares/order';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();
/**
 * @swagger
 * /order/customer:
 *  get:
 *   tags:
 *    - Order
 *   security:
 *    - bearerAuth: []
 *   summary: View Order (Checking, Confirmed, Packaging) For Customer
 *   description: View Order (Checking, Confirmed, Packaging) For Customer
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/CustomerOrderListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/customer',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  OrderMiddleware.viewOrderForCustomer
);

/**
 * @swagger
 * /order/customer-deliver:
 *  get:
 *   tags:
 *    - Order
 *   security:
 *    - bearerAuth: []
 *   summary: View Delivering Order For Customer
 *   description: View Delivering Order For Customer
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/CustomerOrderListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/customer-deliver',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  OrderMiddleware.viewOrderDeliverForCus
);

/**
 * @swagger
 * /order/customer-history:
 *  get:
 *   tags:
 *    - Order
 *   security:
 *    - bearerAuth: []
 *   summary: View Order History (Delivered) For Customer
 *   description: View Order History (Delivered) For Customer
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/CustomerOrderListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/customer-history',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  OrderMiddleware.viewHistoryForCus
);

/**
 * @swagger
 * /order/customer-cancel:
 *  get:
 *   tags:
 *    - Order
 *   security:
 *    - bearerAuth: []
 *   summary: View Canceled Order For Customer
 *   description: View Canceled Order For Customer
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/CustomerOrderListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/customer-cancel',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  OrderMiddleware.viewCancelOrderForCus
);

/**
 * @swagger
 * /order/shop:
 *  get:
 *   tags:
 *    - Order
 *   security:
 *    - bearerAuth: []
 *   summary: View Checking Order For Shop
 *   description: View Checking Order For Shop
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ShopOrderListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/shop',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  OrderMiddleware.viewOrderForShop
);

/**
 * @swagger
 * /order/shop-confirm:
 *  get:
 *   tags:
 *    - Order
 *   security:
 *    - bearerAuth: []
 *   summary: View Confirmed Order For Shop
 *   description: View Confirmed Order For Shop
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ShopOrderListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/shop-confirm',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  OrderMiddleware.viewConfirmOrderForShop
);

/**
 * @swagger
 * /order/shop-deliver:
 *  get:
 *   tags:
 *    - Order
 *   security:
 *    - bearerAuth: []
 *   summary: View Delivering Order For Shop
 *   description: View Delivering Order For Shop
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ShopOrderListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/shop-deliver',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  OrderMiddleware.viewOrderDeliverForShop
);

/**
 * @swagger
 * /order/shop-history:
 *  get:
 *   tags:
 *    - Order
 *   security:
 *    - bearerAuth: []
 *   summary: View Order History (Delivered) For Shop
 *   description: View Order History (Delivered) For Shop
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ShopOrderListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/shop-history',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  OrderMiddleware.viewHistoryForShop
);

/**
 * @swagger
 * /order/new:
 *  post:
 *   tags:
 *    - Order
 *   security:
 *    - bearerAuth: []
 *   summary: Post new order (Shop)
 *   description: Post new order (Shop)
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/OrderRequest'
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ShopOrderListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/new',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  OrderMiddleware.postNew
);

/**
 * @swagger
 * /order/cancel-order/{id}:
 *  post:
 *   tags:
 *    - Order
 *   security:
 *    - bearerAuth: []
 *   summary: Cancel Order (Customer)
 *   description: Cancel Order (Customer)
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *       format: uuid
 *      required: true
 *      description: id of the order
 *      example: 27580e3b-6953-43cc-a482-eaa62b997883
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/ReturnRequest'
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/cancel-order/:id',
  [AuthMiddleware.checkJwt],
  OrderMiddleware.cancelOrder
);

/**
 * @swagger
 * /order/edit-status/{id}:
 *  post:
 *   tags:
 *    - Order
 *   security:
 *    - bearerAuth: []
 *   summary: Edit Order Status (Shop)
 *   description: Edit Order Status (Shop)
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *       format: uuid
 *      required: true
 *      description: id of the order
 *      example: 27580e3b-6953-43cc-a482-eaa62b997883
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/EditRequest'
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/edit-status/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  OrderMiddleware.editDeliveryStatus
);

/**
 * @swagger
 * /order/return-order/{id}:
 *  post:
 *   tags:
 *    - Order
 *   security:
 *    - bearerAuth: []
 *   summary: Edit Order Status (Shop)
 *   description: Edit Order Status (Shop)
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *       format: uuid
 *      required: true
 *      description: id of the order
 *      example: 27580e3b-6953-43cc-a482-eaa62b997883
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/ReturnRequest'
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/return-order/:id',
  [AuthMiddleware.checkJwt],
  OrderMiddleware.returnOrder
);

export default routes;

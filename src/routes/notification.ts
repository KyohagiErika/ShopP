import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import NotificationMiddleware from '../middlewares/notification';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

/**
 * @swagger
 * /notification/shop:
 *  get:
 *   tags:
 *    - Notification
 *   security:
 *    - bearerAuth: []
 *   summary: get Shop Notifications (SHOP)
 *   description: get Shop Notifications (SHOP)
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/NotificationListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/shop',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  NotificationMiddleware.getShopNotifications
);

/**
 * @swagger
 * /notification/customer:
 *  get:
 *   tags:
 *    - Notification
 *   security:
 *    - bearerAuth: []
 *   summary: get Customer Notifications (CUSTOMER)
 *   description: get Customer Notifications (CUSTOMER)
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/NotificationListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/customer',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  NotificationMiddleware.getCustomerNotifications
);

export default routes;

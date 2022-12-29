import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import MessageMiddleware from '../middlewares/message';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

/**
 * @swagger
 * /message/shop/{chatRoomId}:
 *  get:
 *   tags:
 *    - Message
 *   summary: get Shop Messages (SHOP)
 *   description: get Shop Messages (SHOP)
 *   parameters:
 *    - in: path
 *      name: chatRoomId
 *      schema:
 *       type: integer
 *       format: int32
 *      required: true
 *      description: id of the chatRoom
 *      example: 1
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/MessageListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/shop/:chatRoomId([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  MessageMiddleware.getShopMessages
);

/**
 * @swagger
 * /message/customer/{chatRoomId}:
 *  get:
 *   tags:
 *    - Message
 *   security:
 *    - bearerAuth: []
 *   summary: get Customer Messages (CUSTOMER)
 *   description: get Customer Messages (CUSTOMER)
 *   parameters:
 *    - in: path
 *      name: chatRoomId
 *      schema:
 *       type: integer
 *       format: int32
 *      required: true
 *      description: id of the chatRoom
 *      example: 1
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/MessageListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/customer/:chatRoomId([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  MessageMiddleware.getCustomerMessages
);

export default routes;

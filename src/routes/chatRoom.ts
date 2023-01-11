import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import ChatRoomMiddleware from '../middlewares/chatRoom';
import { checkRole } from '../middlewares/checkRole';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

/**
 * @swagger
 * /chat-room/shop:
 *  get:
 *   tags:
 *    - ChatRoom
 *   security:
 *    - bearerAuth: []
 *   summary: get Shop ChatRooms
 *   description: get Shop ChatRooms
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ShopChatRoomListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/shop',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ChatRoomMiddleware.getShopChatRoom
);

/**
 * @swagger
 * /chat-room/customer:
 *  get:
 *   tags:
 *    - ChatRoom
 *   security:
 *    - bearerAuth: []
 *   summary: get Customer ChatRooms
 *   description: get Customer ChatRooms
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/CustomerChatRoomListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/customer',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  ChatRoomMiddleware.getCustomerChatRoom
);

/**
 * @swagger
 * /chat-room/shop/find/{customerId}:
 *  get:
 *   tags:
 *    - ChatRoom
 *   security:
 *    - bearerAuth: []
 *   summary: find Shop ChatRoom
 *   description: find Shop ChatRoom
 *   parameters:
 *    - in: path
 *      name: customerId
 *      schema:
 *       type: string
 *       format: uuid
 *       required: true
 *       description: id of the customer
 *       example: 1fbe4ea5-a957-40bf-9d59-6f390aecaaa3
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ChatRoomResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/shop/find/:customerId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ChatRoomMiddleware.findShopChatRoom
);

/**
 * @swagger
 * /chat-room/customer/find/{shopId}:
 *  get:
 *   tags:
 *    - ChatRoom
 *   security:
 *    - bearerAuth: []
 *   summary: find Customer ChatRoom
 *   description: find Customer ChatRoom
 *   parameters:
 *    - in: path
 *      name: shopId
 *      schema:
 *       type: string
 *       format: uuid
 *       required: true
 *       description: id of the shop
 *       example: 1fbe4ea5-a957-40bf-9d59-6f390aecaaa3
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ChatRoomListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/customer/find/:shopId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  ChatRoomMiddleware.findCustomerChatRoom
);

/**
 * @swagger
 * /chat-room/shop/{customerId}:
 *  post:
 *   tags:
 *    - ChatRoom
 *   security:
 *    - bearerAuth: []
 *   summary: create Shop ChatRoom
 *   description: find Shop ChatRoom
 *   parameters:
 *    - in: path
 *      name: customerId
 *      schema:
 *       type: string
 *       format: uuid
 *       required: true
 *       description: id of the customer
 *       example: 1fbe4ea5-a957-40bf-9d59-6f390aecaaa3
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/shop/:customerId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ChatRoomMiddleware.createShopChat
);

/**
 * @swagger
 * /chat-room/customer/{shopId}:
 *  post:
 *   tags:
 *    - ChatRoom
 *   security:
 *    - bearerAuth: []
 *   summary: create Customer ChatRoom
 *   description: find Customer ChatRoom
 *   parameters:
 *    - in: path
 *      name: shopId
 *      schema:
 *       type: string
 *       format: uuid
 *       required: true
 *       description: id of the shop
 *       example: 1fbe4ea5-a957-40bf-9d59-6f390aecaaa3
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/customer/:shopId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  ChatRoomMiddleware.createCustomerChat
);

/**
 * @swagger
 * /chat-room/delete/{chatRoomId}:
 *  get:
 *   tags:
 *    - ChatRoom
 *   security:
 *    - bearerAuth: []
 *   summary: delete ChatRoom
 *   description: delete ChatRoom
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
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/delete/:chatRoomId([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  ChatRoomMiddleware.deleteChatRoom
);

export default routes;

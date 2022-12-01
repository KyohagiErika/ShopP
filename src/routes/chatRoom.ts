import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import ChatRoomMiddleware from '../middlewares/chatRoom';
import { checkRole } from '../middlewares/checkRole';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

routes.get(
  '/shop',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ChatRoomMiddleware.getShopChatRoom
);

routes.get(
  '/customer',
  AuthMiddleware.checkJwt,
  ChatRoomMiddleware.getCustomerChatRoom
);

routes.get(
  '/shop/find/:customerId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ChatRoomMiddleware.findShopChatRoom
);

routes.get(
  '/customer/find/:shopId',
  AuthMiddleware.checkJwt,
  ChatRoomMiddleware.findCustomerChatRoom
);

routes.post(
  '/:customerId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ChatRoomMiddleware.createShopChat
);

routes.post(
  '/:shopId',
  AuthMiddleware.checkJwt,
  ChatRoomMiddleware.createCustomerChat
);

export default routes;

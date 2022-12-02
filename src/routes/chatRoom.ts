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
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  ChatRoomMiddleware.getCustomerChatRoom
);

routes.get(
  '/shop/find/:customerId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ChatRoomMiddleware.findShopChatRoom
);

routes.get(
  '/customer/find/:shopId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  ChatRoomMiddleware.findCustomerChatRoom
);

routes.post(
  '/shop/:customerId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ChatRoomMiddleware.createShopChat
);

routes.post(
  '/customer/:shopId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  ChatRoomMiddleware.createCustomerChat
);

routes.get(
  '/delete/:chatRoomId([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  ChatRoomMiddleware.deleteChatRoom
);

export default routes;

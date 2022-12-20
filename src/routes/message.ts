import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import MessageMiddleware from '../middlewares/message';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

routes.get(
  '/shop/:chatRoomId([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  MessageMiddleware.getShopMessages
);

routes.get(
  '/customer/:chatRoomId([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  MessageMiddleware.getCustomerMessages
);

export default routes;

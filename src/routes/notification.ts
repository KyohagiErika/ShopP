import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import NotificationMiddleware from '../middlewares/notification';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

routes.get(
  '/shop',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  NotificationMiddleware.getShopNotifications
);

routes.get(
  '/customer',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  NotificationMiddleware.getCustomerNotifications
);

export default routes;

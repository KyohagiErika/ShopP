import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import OrderMiddleware from '../middlewares/order';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

routes.get(
  '/customer',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  OrderMiddleware.viewOrderForCustomer
);

routes.get(
  '/customer-deliver',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  OrderMiddleware.viewOrderDeliverForCus
);

routes.get(
  '/customer-history',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  OrderMiddleware.viewHistoryForCus
);

routes.get(
  '/customer-cancel',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  OrderMiddleware.viewCancelOrderForCus
);

routes.get(
  '/shop',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  OrderMiddleware.viewOrderForShop
);

routes.get(
  '/shop-confirm',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  OrderMiddleware.viewConfirmOrderForShop
);

routes.get(
  '/shop-deliver',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  OrderMiddleware.viewOrderDeliverForShop
);

routes.get(
  '/shop-history',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  OrderMiddleware.viewHistoryForShop
);

routes.post(
  '/new',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  OrderMiddleware.postNew
);

routes.post(
  '/cancel-order/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  OrderMiddleware.cancelOrder
);

routes.post(
  '/edit-status/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  OrderMiddleware.editDeliveryStatus
);

export default routes;

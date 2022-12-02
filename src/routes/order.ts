import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import OrderMiddleware from '../middlewares/order';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

routes.get(
  '/view-order-for-customer',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  OrderMiddleware.viewOrderForCustomer
);

routes.get(
  '/view-order-for-shopp',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  OrderMiddleware.viewOrderForShop
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

import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import OrderMiddlieware from '../middlewares/order';
import ReportMiddleware from '../middlewares/report';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

routes.get(
  '/view-order-for-customer',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  OrderMiddlieware.viewOrderForCustomer
);

routes.get(
  '/view-order-for-shopp',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  OrderMiddlieware.viewOrderForShop
);

routes.post('/new', [AuthMiddleware.checkJwt], OrderMiddlieware.postNew);

routes.post(
  '/cancel-order/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  OrderMiddlieware.cancelOrder
);

routes.post(
  '/edit-status/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  OrderMiddlieware.editDeliveryStatus
);

export default routes;

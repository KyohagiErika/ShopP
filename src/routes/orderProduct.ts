import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import OrderProductMiddleware from '../middlewares/orderProduct';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();
routes.get(
  '/view-order-product/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  OrderProductMiddleware.viewOrderProduct
);

export default routes;

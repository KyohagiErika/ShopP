import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import ReportMiddleware from '../middlewares/report';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

routes.get(
  '/list-all',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  ReportMiddleware.listAll
);

routes.get(
  '/get-report/:id([0-9]+)',
  AuthMiddleware.checkJwt,
  checkRole(RoleEnum.ADMIN),
  ReportMiddleware.getOneById
);

routes.get(
  '/view-report/:id([0-9]+)',
  AuthMiddleware.checkJwt,
  ReportMiddleware.viewReport
);

routes.post(
  '/new-for-customer/:shopId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  ReportMiddleware.postNewForCustomer
);

routes.post(
  '/new-for-shop/:customerId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ReportMiddleware.postNewForShop
);

routes.post(
  '/edit-status/:id([0-9]+)',
  [AuthMiddleware.checkJwt],
  ReportMiddleware.editStatus
);

export default routes;

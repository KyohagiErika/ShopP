import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import { RoleEnum } from '../utils/shopp.enum';
import VoucherMiddleware from '../middlewares/voucher';
const routes = Router();

// list all vouchers
routes.get(
  '/list-All',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  VoucherMiddleware.listAll
);

// create a new voucher
routes.post(
  '/new',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  VoucherMiddleware.newVoucher
);

// edit a voucher
routes.post(
  '/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  VoucherMiddleware.editVoucher
);

// delete a voucher
routes.post(
  '/delete/:id([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  VoucherMiddleware.deleteVoucher
);

// find a voucher
routes.get(
  '/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  VoucherMiddleware.getOneById
);

export default routes;

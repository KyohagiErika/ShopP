import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import { RoleEnum } from '../utils/shopp.enum';
import VoucherMiddleware from '../middlewares/voucher';
const routes = Router();

// list all vouchers
routes.get(
  '/list-all',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  VoucherMiddleware.listAll
);

// list shopP vouchers
routes.get(
  '/list-shopP',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  VoucherMiddleware.listAppVouchers
);

// list shop vouchers
routes.get(
  '/list-shop',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  VoucherMiddleware.listShopVouchers
);

// create a new voucher
routes.post(
  '/new',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  VoucherMiddleware.newVoucher
);

// edit a voucher
routes.post(
  '/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  VoucherMiddleware.editVoucher
);

// delete a voucher
routes.post(
  '/delete/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  VoucherMiddleware.deleteVoucher
);

// save voucher into voucher wallet
routes.post(
  '/save-voucher/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  VoucherMiddleware.saveVoucher
);

// delete customer vouchers
routes.post(
  '/delete-customer-voucher/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  VoucherMiddleware.deleteCustomerVoucher
);

// show shopPVouchers of customer
routes.get(
  '/customer-ShopP',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  VoucherMiddleware.showCustomerAppVouchers
);

// show shopVouchers of customer
routes.get(
  '/customer-Shop',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  VoucherMiddleware.showCustomerShopVouchers
);

// show freeshipVouchers of customer
routes.get(
  '/customer-freeship',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  VoucherMiddleware.showCustomerFreeshipVouchers
);

// show discountVouchers of customer
routes.get(
  '/customer-discount',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  VoucherMiddleware.showCustomerDiscountVouchers
);

// find a voucher
routes.get(
  '/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  VoucherMiddleware.getOneById
);

export default routes;

import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import PackagedProductSize from '../middlewares/packagedProductSize';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

routes.get('/list-all', [AuthMiddleware.checkJwt], PackagedProductSize.listAll);

routes.get(
  '/get-packaged-product-size/:id',
  AuthMiddleware.checkJwt,
  PackagedProductSize.getOneById
);

routes.get(
  '/get-packaged-product-size-of-product/:id',
  AuthMiddleware.checkJwt,
  PackagedProductSize.getOneByProductId
);

routes.post(
  '/new/:productId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  PackagedProductSize.postNew
);

routes.post(
  '/edit/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  PackagedProductSize.edit
);

export default routes;

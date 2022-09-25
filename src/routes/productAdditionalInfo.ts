import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import ProductAdditionalInfo from '../middlewares/productAdditionalInfo';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

routes.get(
  '/list-all',
  [AuthMiddleware.checkJwt],
  ProductAdditionalInfo.listAll
);

routes.get(
  '/get-product-information/:id',
  AuthMiddleware.checkJwt,
  ProductAdditionalInfo.getOneById
);

routes.post(
  '/new/:productId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ProductAdditionalInfo.postNew
);

routes.post(
  '/edit/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ProductAdditionalInfo.edit
);

export default routes;

import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import ShopMiddleware from '../middlewares/shop';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

routes.get(
  '/list-all',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  ShopMiddleware.listAll
);

routes.get('/:id', AuthMiddleware.checkJwt, ShopMiddleware.getOneById);

routes.post(
  '/new/:user-id([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  ShopMiddleware.postNew
);

routes.post(
  '/edit/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ShopMiddleware.edit
);

export default routes;

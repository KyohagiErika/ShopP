import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import ShoppingUnitMiddleware from '../middlewares/shoppingUnit';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

routes.get(
  '/list-all',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  ShoppingUnitMiddleware.listAll
);

routes.get(
  '/:id([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  ShoppingUnitMiddleware.getOneById
);

routes.post(
  '/new',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  ShoppingUnitMiddleware.postNew
);

export default routes;

import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import ProductMiddleware from '../middlewares/product';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

routes.get('/list-all', ProductMiddleware.listAll); //[checkJwt, checkRole(RoleEnum.ADMIN)],

routes.get('/getOneById/:id', ProductMiddleware.getOneById); //[checkJwt, checkRole(RoleEnum.ADMIN)],

routes.get('/searchByName/:name', ProductMiddleware.searchByName);

routes.get(
  '/searchByCategory/:categoryId([0-9]+)',
  ProductMiddleware.searchByCategory
);

routes.get(
  '/searchByCategoryName/:name',
  ProductMiddleware.searchByCategoryName
);

routes.get('/searchByShop/:shopId', ProductMiddleware.searchByShop);

routes.post(
  '/new/:shopId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ProductMiddleware.postNew
); //[checkJwt, checkRole(RoleEnum.ADMIN)],

routes.post(
  '/edit/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ProductMiddleware.edit
);

routes.post(
  '/delete/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ProductMiddleware.delete
); //[checkJwt, checkRole(RoleEnum.ADMIN)],

export default routes;

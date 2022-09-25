import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import ProductMiddleware from '../middlewares/product';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

routes.get('/list-all', ProductMiddleware.listAll); //[checkJwt, checkRole(RoleEnum.ADMIN)],

routes.get('/get-one-by-id/:id', ProductMiddleware.getOneById); //[checkJwt, checkRole(RoleEnum.ADMIN)],

routes.get('/search-by-name/:name', ProductMiddleware.searchByName);

routes.get(
  '/search-by-category/:categoryId([0-9]+)',
  ProductMiddleware.searchByCategory
);

routes.get(
  '/search-by-category-name/:name',
  ProductMiddleware.searchByCategoryName
);

routes.get('/search-by-shop/:shopId', ProductMiddleware.searchByShop);

routes.post(
  '/new',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ProductMiddleware.postNew
);

routes.post(
  '/edit/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ProductMiddleware.edit
);

routes.post(
  '/delete/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ProductMiddleware.delete
);
export default routes;

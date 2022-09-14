import { Router } from 'express';
import ProductMiddleware from '../middlewares/product';

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

routes.post('/new/:shopId', ProductMiddleware.postNew); //[checkJwt, checkRole(RoleEnum.ADMIN)],

routes.post('/edit/:id', ProductMiddleware.edit);

routes.post('/delete/:id', ProductMiddleware.delete); //[checkJwt, checkRole(RoleEnum.ADMIN)],

export default routes;

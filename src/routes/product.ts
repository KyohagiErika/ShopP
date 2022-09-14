import { Router } from 'express';
import ProductMiddleware from '../middlewares/product';

const routes = Router();

routes.get('/list-all', ProductMiddleware.listAll); //[checkJwt, checkRole(RoleEnum.ADMIN)],

routes.get('/getOneById/:id', ProductMiddleware.getOneById); //[checkJwt, checkRole(RoleEnum.ADMIN)],

routes.get('/getOneByName/:name', ProductMiddleware.getOneByName);

routes.get(
  '/getOneByCategory/:categoryId([0-9]+)',
  ProductMiddleware.getOneByCategory
);

routes.get(
  '/getOneByCategoryName/:name',
  ProductMiddleware.getOneByCategoryName
);

routes.get('/getOneByShop/:shopId', ProductMiddleware.getOneByShop);

routes.post('/new/:shopId', ProductMiddleware.postNew); //[checkJwt, checkRole(RoleEnum.ADMIN)],

routes.post('/edit/:id', ProductMiddleware.edit);

routes.post('/delete/:id', ProductMiddleware.delete); //[checkJwt, checkRole(RoleEnum.ADMIN)],

export default routes;

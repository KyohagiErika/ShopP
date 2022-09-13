import { Router } from 'express';
import ProductMiddleware from '../middlewares/product';

const routes = Router();

routes.get('/list-all', ProductMiddleware.listAll); //[checkJwt, checkRole(RoleEnum.ADMIN)],

routes.get('/get/:id', ProductMiddleware.getOneById); //[checkJwt, checkRole(RoleEnum.ADMIN)],

routes.get('/get/:name', ProductMiddleware.getOneByName);

routes.get('/get/:categoryId', ProductMiddleware.getOneByCategory);

routes.get('/get/:shopId', ProductMiddleware.getOneByShop);

routes.post('/new/:shopId', ProductMiddleware.postNew); //[checkJwt, checkRole(RoleEnum.ADMIN)],

routes.post('/edit/:id', ProductMiddleware.edit);

routes.post('/delete/:id', ProductMiddleware.delete); //[checkJwt, checkRole(RoleEnum.ADMIN)],

export default routes;

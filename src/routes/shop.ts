import { Router } from 'express';
import ShopMiddleware from '../middlewares/shop';

const routes = Router();

routes.get('/list-all', ShopMiddleware.listAll); //[checkJwt, checkRole(RoleEnum.ADMIN)],

routes.get('/:id', ShopMiddleware.getOneById); //[checkJwt, checkRole(RoleEnum.ADMIN)],

routes.post('/new/:user-id([0-9]+)', ShopMiddleware.postNew); //[checkJwt, checkRole(RoleEnum.ADMIN)],

routes.post('/edit/:id', ShopMiddleware.edit); //[checkJwt], checkRole(RoleEnum.ADMIN);

export default routes;

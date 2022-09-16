import { Router } from 'express';
import CategoryMiddleware from '../middlewares/category';

const routes = Router();

routes.get('/list-all', CategoryMiddleware.listAll); //[checkJwt, checkRole(RoleEnum.ADMIN)],

routes.get('/:id([0-9]+)', CategoryMiddleware.getOneById); //[checkJwt, checkRole(RoleEnum.ADMIN)],

routes.post('/new', CategoryMiddleware.postNew); //[checkJwt, checkRole(RoleEnum.ADMIN)],

export default routes;

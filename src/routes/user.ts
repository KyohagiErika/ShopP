import { Router } from 'express';
import { checkJwt } from '../middlewares/checkJwt';
import { checkRole } from '../middlewares/checkRole';
import { RoleEnum } from '../utils/shopp.enum';
import UserMiddleware from '../middlewares/user';

const routes = Router();

//Get all users
routes.get('/list-all', UserMiddleware.listAll); //[checkJwt, checkRole(RoleEnum.ADMIN)],

// Get one user
routes.get('/:id([0-9]+)', UserMiddleware.getOneById); //[checkJwt, checkRole(RoleEnum.ADMIN)],

//Create a new user
routes.post('/', UserMiddleware.postNew); //[checkJwt, checkRole(RoleEnum.ADMIN)],

//Edit one user
routes.put(
  '/:id([0-9]+)',
  [checkJwt, checkRole(RoleEnum.ADMIN)],
  UserMiddleware.edit
);

//Delete one user
routes.put('/delete/:id([0-9]+)', UserMiddleware.delete); //[checkJwt, checkRole(RoleEnum.ADMIN)],

export default routes;

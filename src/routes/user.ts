import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import { RoleEnum } from '../utils/shopp.enum';
import UserMiddleware from '../middlewares/user';

const routes = Router(); //localhost:3000/user/123

//Get all users
routes.get(
  '/list-all',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  UserMiddleware.listAll
);

// Get one user
routes.get('/:id([0-9]+)', AuthMiddleware.checkJwt, UserMiddleware.getOneById);

//Create a new user
routes.post('/sign-up', UserMiddleware.postNew);

//Create a new admin
routes.post('/sign-up-admin', UserMiddleware.postNewAdmin);

//Edit one user
routes.post('/edit', AuthMiddleware.checkJwt, UserMiddleware.edit);

//Delete one user
routes.post('/delete', AuthMiddleware.checkJwt, UserMiddleware.delete);

export default routes;

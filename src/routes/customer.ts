import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { RoleEnum } from '../utils/shopp.enum';
import CustomerMiddleware from '../middlewares/customer';
import { checkRole } from '../middlewares/checkRole';
import { uploadImage } from '../middlewares/fileProvider';

const routes = Router();

//Get all customers
routes.get(
  '/list-all',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  CustomerMiddleware.listAll
);

// Get one customer
routes.get(
  '/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  CustomerMiddleware.getOneById
);

//Create a new customer
routes.post(
  '/new',
  AuthMiddleware.checkJwt,
  uploadImage('avatar'),
  CustomerMiddleware.postNew
);

//Edit one customer
routes.post(
  '/edit',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  uploadImage('avatar'),
  CustomerMiddleware.edit
);

export default routes;

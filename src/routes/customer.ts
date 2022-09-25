import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { RoleEnum } from '../utils/shopp.enum';
import CustomerMiddleware from '../middlewares/customer';
import { checkRole } from '../middlewares/checkRole';

const routes = Router();

//Get all customers
routes.get(
  '/list-all',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  CustomerMiddleware.listAll
);

// Get one customer
routes.get('/:id', AuthMiddleware.checkJwt, CustomerMiddleware.getOneById);

//Create a new customer
routes.post('/new', AuthMiddleware.checkJwt, CustomerMiddleware.postNew);

//Edit one customer
routes.post(
  '/edit',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  CustomerMiddleware.edit
);

export default routes;

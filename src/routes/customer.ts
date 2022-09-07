import { Router } from 'express';
import { checkJwt } from '../middlewares/checkJwt';
import { checkRole } from '../middlewares/checkRole';
import { RoleEnum } from '../utils/shopp.enum';
import CustomerMiddleware from '../middlewares/customer';

const routes = Router();

//Get all customers
routes.get('/list-all', CustomerMiddleware.listAll); //[checkJwt, checkRole(RoleEnum.ADMIN)],

// Get one customer
routes.get('/:id', CustomerMiddleware.getOneById); //[checkJwt, checkRole(RoleEnum.ADMIN)],

//Create a new customer
routes.post('/', CustomerMiddleware.postNew); //[checkJwt, checkRole(RoleEnum.ADMIN)],

//Edit one customer
routes.post('/:id', CustomerMiddleware.edit);

export default routes;

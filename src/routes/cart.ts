import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import CartMiddleware from '../middlewares/cart';
import { checkRole } from '../middlewares/checkRole';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

routes.get('/:cartId([0-9]+)', [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)], CartMiddleware.showCart);

routes.post('/update/:cartId([0-9]+)', [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)], CartMiddleware.update);

export default routes;

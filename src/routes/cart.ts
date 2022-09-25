import { Router } from 'express';
import CartMiddleware from '../middlewares/cart';

const routes = Router();

routes.get('/:id', CartMiddleware.showCart);

export default routes;

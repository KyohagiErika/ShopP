import { Router } from 'express';
import CartMiddleware from '../middlewares/cart';

const routes = Router();

routes.get('/:id', CartMiddleware.showCart);
routes.post('/', CartMiddleware.postNew);

export default routes;

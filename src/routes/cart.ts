import { Router } from 'express';
import CartMiddleware from '../middlewares/cart';

const routes = Router();

routes.get('/:cartId([0-9]+)', CartMiddleware.showCart);

routes.post('/new', CartMiddleware.postNew);

routes.post('/update/:cartId([0-9]+)', CartMiddleware.update);

export default routes;

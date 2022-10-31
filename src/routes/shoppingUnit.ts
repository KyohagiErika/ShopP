import { Router } from "express";
import ShoppingUnitMiddleware from "../middlewares/shoppingUnit";

const routes = Router();

routes.get('/list-all', ShoppingUnitMiddleware.listAll);

routes.get('/:id([0-9]+)', ShoppingUnitMiddleware.getOneById);

routes.post('/new', ShoppingUnitMiddleware.postNew);

export default routes;
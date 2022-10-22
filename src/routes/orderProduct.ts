import { Router } from "express";
import AuthMiddleware from "../middlewares/auth";
import OrderProductMiddleware from "../middlewares/orderProduct";

const routes = Router();
routes.get(
    '/view-order-product/:id', [AuthMiddleware.checkJwt],
    OrderProductMiddleware.viewOrderProduct
);

routes.post(
    '/new',
    [AuthMiddleware.checkJwt],
    OrderProductMiddleware.postNew
);

export default routes;
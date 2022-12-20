import { Router } from "express";
import TrackingOrderMiddleware from "../middlewares/trackingOrder";

const routes = Router();
routes.get(
    '/view/:orderId',
    TrackingOrderMiddleware.viewTrackingOrder
);

routes.get(
    '/get-one/:id([0-9]+)',
    TrackingOrderMiddleware.getOneById
);

export default routes;
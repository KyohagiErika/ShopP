import { Request, Response } from "express";
import trackingOrderModel from "../models/trackingOrder";
import { ControllerService } from "../utils/decorators";
import { HttpStatusCode } from "../utils/shopp.enum";

export default class TrackingOrderMiddleware {
    @ControllerService()
    static async viewTrackingOrder(req: Request, res: Response) {
        const orderNumber = req.params.orderId;
        const result = await trackingOrderModel.trackingOrder(orderNumber);
        if (result) {
            res.status(HttpStatusCode.OK).send({ data: result });
        } else {
            res
                .status(HttpStatusCode.BAD_REQUEST)
                .send({ message: 'Get tracking order failed!' });
        }
    }

    static async getOneById(req: Request, res: Response) {
        const id = +req.params.id;
        const result = await trackingOrderModel.getOneById(id);
        if (result) {
            res.status(HttpStatusCode.OK).send({ data: result });
        } else {
            res
                .status(HttpStatusCode.BAD_REQUEST)
                .send({ message: 'Get tracking order failed!' });
        }
    }
}
import { Request, Response } from "express";
import orderProductModel from "../models/orderProduct";
import { ControllerService } from "../utils/decorators";
import { HttpStatusCode } from "../utils/shopp.enum";

export default class OrderProductMiddleware {
    @ControllerService()
    static async viewOrderProduct(req: Request, res: Response) {
        const orderNumber = req.params.id;
        const result = await orderProductModel.viewOrderProduct(orderNumber);
        if (result) {
            res.status(HttpStatusCode.OK).send({ data: result });
        } else {
            res
                .status(HttpStatusCode.BAD_REQUEST)
                .send({ message: 'Get order product failed!' });
        }
    }

    @ControllerService()
    static async postNew(req: Request, res: Response) {
        const data = req.body;
        const result = await orderProductModel.postNew(
            data.price,
            data.quantity,
            data.additionalInfo,
            data.productId,
            data.orderNumber,
        );
        if (result.getCode() === HttpStatusCode.CREATED) {
            res
                .status(result.getCode())
                .send({ message: result.getMessage(), data: result.getData() });
        } else {
            res.status(result.getCode()).send({ message: result.getMessage() });
        }
    }


}
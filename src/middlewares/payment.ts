import { Request, Response } from "express";
import PaymentModel from "../models/payment";
import { ControllerService } from "../utils/decorators";
import { HttpStatusCode } from "../utils/shopp.enum";

export default class PaymentMiddleware {
    @ControllerService()
    static async listAll(req: Request, res: Response) {
        const result = await PaymentModel.listAll();
        if (result) {
            res.status(HttpStatusCode.OK).send({ data: result });
        } else {
            res
                .status(HttpStatusCode.BAD_REQUEST)
                .send({ message: 'Get payment failed!' });
        }
    }

    @ControllerService()
    static async getOneById(req: Request, res: Response) {
        const id = +req.params.id;
        const result = await PaymentModel.getOneById(id);
        if (result) {
            res.status(HttpStatusCode.OK).send({ data: result });
        } else {
            res
                .status(HttpStatusCode.BAD_REQUEST)
                .send({ message: 'Get payment failed!' });
        }
    }

    @ControllerService({
        body: [
            {
                name: 'name',
                type: String,
            },
        ],
    })
    static async postNew(req: Request, res: Response) {
        const data = req.body;
        const result = await PaymentModel.postNew(data.name);
        if (result.getCode() === HttpStatusCode.CREATED) {
            res
                .status(result.getCode())
                .send({ message: result.getMessage(), data: result.getData() });
        } else {
            res.status(result.getCode()).send({ message: result.getMessage() });
        }
    }
}
import { Request, Response } from "express";
import ShopModel from "../models/shop";
import { ControllerService } from "../utils/decorators";
import { HttpStatusCode } from "../utils/shopp.enum";

export default class ShopMiddleware {
    @ControllerService()
    static async listAll(req: Request, res: Response) {
        const result = await ShopModel.listAll();
        if (result) {
            res.status(HttpStatusCode.OK).send(result);
        } else {
            res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Get shop failed!' });
        }
    }

    @ControllerService({
        params: [{
            name: 'id',
            type: String
        }]
    })
    static async getOneById(req: Request, res: Response) {
        const id = req.params.id;
        const result = await ShopModel.getOneById(id);
        if (result) {
            res.status(HttpStatusCode.OK).send(result);
        } else {
            res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Get shop failed!' });
        }
    }

    @ControllerService({
        body: [{
            name: 'name',
            type: String
        },
        {
            name: 'avatar',
            type: String,

        },
        {
            name: 'email',
            type: String,
            validator: (propName: string, value: string) => {
                if(!value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) ) return `${propName} must be valid email`;
                return null;
            }

        },
        {
            name: 'phone',
            type: String,
            validator: (propName: string, value: string) => {
                if(!value.match(/^\d{10}$/)) return `${propName} must be valid phone`;
                return null;
            }

        },
        {
            name: 'placeOfReceipt',
            type: String,


        }]
    })
    static async postNew(req: Request, res: Response) {
        const data = req.body;
        const userId = +req.params.userId
        const result = await ShopModel.postNew(data.name.toString(), data.avatar.toString(), userId, data.email.toString(), data.phone.toString(), data.placeOfReceipt.toString());
        if (result.getCode() === HttpStatusCode.CREATED) {
            res.status(result.getCode()).send({message: result.getMessage(), data: result.getData()});
          } else {
            res.status(result.getCode()).send({message: result.getMessage()});
          }
    }

    @ControllerService({
        params: [{
            name: 'id',
            type: String
        }],
        body: [{
            name: 'name',
            type: String
        },
        {
            name: 'avatar',
            type: String,


        },
        {
            name: 'email',
            type: String,
            validator: (propName: string, value: string) => {
                if(!value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) ) `${propName} must be valid email`;
                return null;
            }

        },
        {
            name: 'phone',
            type: String,
            validator: (propName: string, value: string) => {
                if(!value.match(/^\d{10}$/)) `${propName} must be valid phone`;
                return null;
            }

        },
        {
            name: 'placeOfReceipt',
            type: String,


        }]
    })
    static async edit(req: Request, res: Response) {
        const data = req.body;
        const id = req.params.id;
        const result = await ShopModel.edit(id, data.name.toString(), data.avatar.toString(), data.email.toString(), data.phone.toString(), data.placeOfReceipt.toString());
        if (result.getCode() === HttpStatusCode.OK) {
            res.status(result.getCode()).send({message: result.getMessage(), data: result.getData()});
          } else {
            res.status(result.getCode()).send({message: result.getMessage()});
          }
    }
}

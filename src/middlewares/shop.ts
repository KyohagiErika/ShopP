import { Request, Response } from "express";
import UserModel from "../models/user";
import ShopModel from "../models/shop";
import { ControllerService } from "../utils/decorators";
import { RoleEnum } from "../utils/shopp.enum";
import { checkJwt } from "./checkJwt"

export default class ShopMiddleware {
    @ControllerService()
    static async listAll (req: Request, res: Response) {
        const result = await ShopModel.listAll();
        if (result) {
            res.send(result);
        } else {
            res.status(400).send('Get shop failed!');
        }
    }

    @ControllerService()
    static async getOneById (req: Request, res: Response) {
        const id = +req.params.id;//(req.params as unknown) as number;
        if (id) {
            const result = await ShopModel.getOneById(id.toString());
            if (result) {
                res.send(result);
            } else {
                res.status(400).send('Get shop failed!' + id);
            }
            res.status(200);
        } else {
            res.status(400).send('Incorrect id! ' + id);
        }
    }

    @ControllerService()
    static async postNew (req: Request, res: Response) {
        const data = req.body;
        const userId = +req.params.userId
        if (data.name && data.avatar && userId && data.email &&  data.phone  && data.placeOfReceipt ) {
            const result = await ShopModel.postNew(data.name.toString(), data.avatar.toString(), userId, data.email.toString(), data.phone.toString(), data.placeOfReceipt.toString());
            if (result) {
                res.send(result);
            } else {
                res.status(400).send('Post data failed!');
            }
        } else {
            res.status(400).send('Incorrect input data!');
        }
    }

    @ControllerService()
    static async edit  (req: Request, res: Response) {
        const data = req.query;
        const id = (req.params as unknown) as number;
        const avatar = (req.params as unknown) as number;
        if (id && data.name && data.avatar && data.email &&  data.phone  && data.placeOfReceipt  ) {
            const result = await ShopModel.edit(id.toString(), data.name.toString(), avatar, data.email.toString(), data.phone.toString(),  data.placeOfReceipt.toString());
            if (result) {
                res.send(result);
            } else {
                res.status(400).send('Insert data failed!');
            }
        } else {
            res.status(400).send('Incorrect input data!');
        }
    }

    @ControllerService()
    static async delete (req: Request, res: Response) {
        const id = +req.params.id;//parseInt(req.params);//(req.params as unknown) as number;
        if (id) {
            const result = await UserModel.delete(id);
            if (result) {
                res.send(result);
            } else {
                res.status(400).send('Delete data failed!' + id);
            }
        } else {
            res.status(400).send('Incorrect id!'+id);
        }
    }
}

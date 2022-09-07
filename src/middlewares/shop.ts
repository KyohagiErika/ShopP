import { Request, Response } from "express";
import UserModel from "../models/user";
import ShopModel from "../models/shop";
import { ControllerService } from "../utils/decorators";
import { HttpStatusCode, RoleEnum } from "../utils/shopp.enum";
import { checkJwt } from "./checkJwt"
import { Validator } from "class-validator";

export default class ShopMiddleware {

    // @ControllerService({
    //     deepWatch: true,
    //     body: [
    //         {
    //         name: 'Hello',
    //         type: Number,
    //         validator: (propName: string, value: number) => {
    //             if (value<=10) return $(propName);
    //             if (value>=100) return $(propName);
    //             return null;
    //         },
    //     },
    //     ],

    // })
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
        const id = req.params.id;//(req.params as unknown) as number;
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

        },
        {
            name: 'phone',
            type: String,

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
        if (result) {
            res.status(HttpStatusCode.OK).send(result);
        } else {
            res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Post shop failed!' });
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
                if (value = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$') return propName;
                return null;
            }

        },
        {
            name: 'phone',
            type: String,
            validator: (propName: string, value: string) => {
                if (value = '^((\\+91-?)|0)?[0-9]{10}$') return propName;
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
        const id = +req.params.id;// validator param
        const result = await ShopModel.edit(id.toString(), data.name.toString(), data.avatar.toString(), data.email.toString(), data.phone.toString(), data.placeOfReceipt.toString());
        if (result) {
            res.status(HttpStatusCode.OK).send(result);
        } else {
            res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Edit shop failed!' });
        }
    }

    // @ControllerService()
    // static async delete(req: Request, res: Response) {
    //     const id = +req.params.id;//parseInt(req.params);//(req.params as unknown) as number;
    //     if (id) {
    //         const result = await UserModel.delete(id);
    //         if (result) {
    //             res.send(result);
    //         } else {
    //             HttpStatusCode.BAD_REQUEST
    //         }
    //     } else {
    //         HttpStatusCode.BAD_REQUEST
    //     }
    // }
}

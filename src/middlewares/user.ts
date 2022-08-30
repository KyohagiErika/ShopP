import { Request, Response } from "express";
import UserModel from "../models/user";
import { ControllerService } from "../utils/decorators";
import { RoleEnum } from "../utils/shopp.enum"

export default class UserMiddleware {
    @ControllerService()
    static async listAll (req: Request, res: Response) {
        const result = await UserModel.listAll();
        if (result) {
            res.send(result);
        } else {
            res.status(400).send('Get user failed!');
        }
    }

    @ControllerService()
    static async getOneById (req: Request, res: Response) {
        const id = +req.params.id;//(req.params as unknown) as number;
        if (id) {
            const result = await UserModel.getOneById(id);
            if (result) {
                res.send(result);
            } else {
                res.status(400).send('Get user failed!' + id);
            }
            res.status(200);
        } else {
            res.status(400).send('Incorrect id! ' + id);
        }
    }

    @ControllerService()
    static async postNew (req: Request, res: Response) {
        const data = req.body;
        if (data.email && data.password && data.phone) {
            const result = await UserModel.postNew(data.email.toString(), data.phone.toString(), data.password.toString(), RoleEnum.CUSTOMER);
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
        if (data.username && id && data.role) {
            const result = await UserModel.edit(id, data.username.toString(), data.role.toString());
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
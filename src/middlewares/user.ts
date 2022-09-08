import { Request, Response } from 'express';
import UserModel from '../models/user';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode, RoleEnum } from '../utils/shopp.enum';

export default class UserMiddleware {
  @ControllerService()
  static async listAll(req: Request, res: Response) {
    const result = await UserModel.listAll();
    if (result) {
      res.status(HttpStatusCode.OK).send({data: result});
    } else {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Get all users failed!' });
    }
  }

  @ControllerService()
  static async getOneById(req: Request, res: Response) {
    const id = +req.params.id;
    const result = await UserModel.getOneById(id);
    if (result) {
      res.status(HttpStatusCode.OK).send({data: result});
    } else {
      res.status(HttpStatusCode.BAD_REQUEST).send({message: 'This user not exist!'});
    }
  }

  @ControllerService({
    body: [{
      name: 'email',
      type: String,
      validator: (propName: string, value: string) => {

        return null;
      }
    } ,{
      name: 'password',
      type: String,
      validator: (propName: string, value: string) => {

        return null;
      }
    }, {
      name: 'phone',
      type: String,
      validator: (propName: string, value: string) => {

        return null;
      }
    }]
  })
  static async postNew(req: Request, res: Response) {
    const data = req.body;
    const result = await UserModel.postNew(data.email, data.phone, data.password, RoleEnum.CUSTOMER);
    if (result.getCode() === HttpStatusCode.CREATED) {
      res.status(result.getCode()).send({message: result.getMessage(), data: result.getData()});
    } else {
      res.status(result.getCode()).send({message: result.getMessage()});
    }
  }

  @ControllerService({
    body: [{
      name: 'email',
      type: String,
      validator: (propName: string, value: string) => {

        return null;
      }
    }, {
      name: 'phone',
      type: String,
      validator: (propName: string, value: string) => {

        return null;
      }
    }]
  })
  static async edit(req: Request, res: Response) {
    const data = req.body;
    const id = +req.params.id;
    const result = await UserModel.edit(id, data.email, data.phone);
    res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async delete(req: Request, res: Response) {
    const id = +req.params.id;
    const result = await UserModel.delete(id);
    res.status(result.getCode()).send({ message: result.getMessage() });
  }
}

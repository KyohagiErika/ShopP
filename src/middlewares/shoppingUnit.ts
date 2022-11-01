import { Request, Response } from 'express';
import ShoppingUnitModel from '../models/shoppingUnit';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode } from '../utils/shopp.enum';

export default class ShoppingUnitMiddleware {
  @ControllerService()
  static async listAll(req: Request, res: Response) {
    const result = await ShoppingUnitModel.listAll();
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get shopping unit failed!' });
    }
  }

  @ControllerService()
  static async getOneById(req: Request, res: Response) {
    const id = +req.params.id;
    const result = await ShoppingUnitModel.getOneById(id);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get shopping unit failed!' });
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
    const result = await ShoppingUnitModel.postNew(data.name);
    if (result.getCode() === HttpStatusCode.CREATED) {
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    } else {
      res.status(result.getCode()).send({ message: result.getMessage() });
    }
  }
}

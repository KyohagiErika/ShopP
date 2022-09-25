import { Request, Response } from 'express';
import CategoryModel from '../models/category';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode, ProductEnum } from '../utils/shopp.enum';

export default class ProductMiddleware {
  @ControllerService()
  static async listAll(req: Request, res: Response) {
    const result = await CategoryModel.listAll();
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get Category failed!' });
    }
  }

  @ControllerService()
  static async getOneById(req: Request, res: Response) {
    const id = +req.params.id;
    const result = await CategoryModel.getOneById(id);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get Category failed!' });
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
    const result = await CategoryModel.postNew(data.name, data.description);
    if (result.getCode() === HttpStatusCode.CREATED) {
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    } else {
      res.status(result.getCode()).send({ message: result.getMessage() });
    }
  }
}

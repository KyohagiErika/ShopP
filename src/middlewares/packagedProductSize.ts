import { Request, Response } from 'express';
import PackagedProductSizeModel from '../models/packagedProductSize';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode } from '../utils/shopp.enum';

export default class PackagedProductSizeMiddleware {
  @ControllerService()
  static async listAll(req: Request, res: Response) {
    const result = await PackagedProductSizeModel.listAll();
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get Product Information failed!' });
    }
  }

  @ControllerService({
    params: [
      {
        name: 'id',
        type: String,
      },
    ],
  })
  static async getOneById(req: Request, res: Response) {
    const id = +req.params.id;
    const result = await PackagedProductSizeModel.getOneById(id);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get Product Information failed!' });
    }
  }

  @ControllerService({
    params: [
      {
        name: 'productId',
        type: String,
      },
    ],
    body: [
      {
        name: 'weight',
        type: String,
      },
      {
        name: 'height',
        type: String,
      },
      {
        name: 'width',
        type: String,
      },
      {
        name: 'lenght',
        type: String,
      }
    ],
  })
  static async postNew(req: Request, res: Response) {
    const data = req.body;
    const productId = req.params.productId;
    const result = await PackagedProductSizeModel.postNew(
      productId,
      data.weight,
      data.height,
      data.width,
      data.lenght

    );
    if (result.getCode() === HttpStatusCode.CREATED) {
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    } else {
      res.status(result.getCode()).send({ message: result.getMessage() });
    }
  }

  @ControllerService({
    params: [
      {
        name: 'id',
        type: String,
      },
    ],
    body: [
      {
        name: 'weight',
        type: String,
      },
      {
        name: 'height',
        type: String,
      },
      {
        name: 'width',
        type: String,
      },
      {
        name: 'lenght',
        type: String,
      }
    ],
  })
  static async edit(req: Request, res: Response) {
    const data = req.body;
    const id = +req.params.id;
    const result = await PackagedProductSizeModel.edit(
      id,
      data.weight,
      data.height,
      data.width,
      data.lenght
    );
    if (result.getCode() === HttpStatusCode.OK) {
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    } else {
      res.status(result.getCode()).send({ message: result.getMessage() });
    }
  }

}


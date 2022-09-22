import { Request, Response } from 'express';
import ProductAdditionInfoModel from '../models/productAdditionalInfo';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode } from '../utils/shopp.enum';

export default class ProductAddInfoMiddleware {
  @ControllerService()
  static async listAll(req: Request, res: Response) {
    const result = await ProductAdditionInfoModel.listAll();
    if (result) {
      res.status(HttpStatusCode.OK).send({data: result});
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
    const result = await ProductAdditionInfoModel.getOneById(id);
    if (result) {
      res.status(HttpStatusCode.OK).send({data: result});
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
        name: 'key',
        type: String,
      },
      {
        name: 'value',
        type: String,
      },
    ],
  })
  static async postNew(req: Request, res: Response) {
    const data = req.body;
    const productId = req.params.productId;
    const result = await ProductAdditionInfoModel.postNew(
      productId,
      data.key,
      data.value,
      
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
          name: 'key',
          type: String,
        },
        {
          name: 'value',
          type: String,
        },
      ],
    })
  static async edit(req: Request, res: Response) {
    const data = req.body;
    const id = +req.params.id;
    const result = await ProductAdditionInfoModel.edit(
      id,
      data.key,
      data.value,
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

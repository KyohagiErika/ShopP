import { Request, Response } from 'express';
import ProductModel from '../models/product';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode, ProductEnum } from '../utils/shopp.enum';

export default class ProductMiddleware {
  @ControllerService()
  static async listAll(req: Request, res: Response) {
    const result = await ProductModel.listAll();
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get Product failed!' });
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
    const id = req.params.id;
    const result = await ProductModel.getOneById(id);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get Product failed!' });
    }
  }

  @ControllerService({
    params: [
      {
        name: 'name',
        type: String,
      },
    ],
  })
  static async searchByName(req: Request, res: Response) {
    const name = req.params.name;
    const result = await ProductModel.searchByName(name);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get Product failed!' });
    }
  }

  @ControllerService()
  static async searchByCategory(req: Request, res: Response) {
    const id = +req.params.categoryId;
    const result = await ProductModel.searchByCategory(id);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get Product failed!' });
    }
  }

  @ControllerService({
    params: [
      {
        name: 'name',
        type: String,
      },
    ],
  })
  static async searchByCategoryName(req: Request, res: Response) {
    const name = req.params.name;
    const result = await ProductModel.searchByCategoryName(name);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get Product failed!' });
    }
  }

  @ControllerService({
    params: [
      {
        name: 'shopId',
        type: String,
      },
    ],
  })
  static async searchByShop(req: Request, res: Response) {
    const shopId = req.params.id;
    const result = await ProductModel.searchByShop(shopId);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get Product failed!' });
    }
  }

  @ControllerService({
    params: [
      {
        name: 'shopId',
        type: String,
      },
    ],
    body: [
      {
        name: 'category',
        type: String,
      },
      {
        name: 'name',
        type: String,
      },
      {
        name: 'detail',
        type: String,
      },
      {
        name: 'amount',
        type: String,
      },
    ],
  })
  static async postNew(req: Request, res: Response) {
    const data = req.body;
    const shopId = req.params.shopId;
    const result = await ProductModel.postNew(
      shopId,
      data.name,
      data.category,
      data.detail.toString(),
      data.amount,
      ProductEnum.AVAILABLE
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
        name: 'name',
        type: String,
      },
      {
        name: 'category',
        type: String,
      },

      {
        name: 'detail',
        type: String,
      },
      {
        name: 'amount',
        type: String,
      },
      {
        name: 'status',
        type: String,
        validator: (propName: string, value: string) => {
          if (
            value.toUpperCase() !== 'AVAILABLE' &&
            value.toUpperCase() !== 'OUT-OF-ORDER'
          )
            return `${propName} is only AVAILABLE or OUT-OF-ORDER`;
          return null;
        },
      },
    ],
  })
  static async edit(req: Request, res: Response) {
    const data = req.body;
    const id = req.params.id;
    let status: ProductEnum;
    if (data.status.toString().toUpperCase() === 'AVAILABLE') {
      status = ProductEnum.AVAILABLE;
    } else {
      status = ProductEnum.OUT_OF_ORDER;
    }
    const result = await ProductModel.edit(
      id,
      data.name,
      data.category,
      data.detail.toString(),
      data.amount,
      status
    );
    if (result.getCode() === HttpStatusCode.OK) {
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
  })
  static async delete(req: Request, res: Response) {
    const id = req.params.id;
    const result = await ProductModel.delete(id);
    res.status(result.getCode()).send({ message: result.getMessage() });
  }
}

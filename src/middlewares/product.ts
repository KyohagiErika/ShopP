import { Request, Response } from 'express';
import { EntityManager } from 'typeorm';
import { ShopPDataSource } from '../data';
import { LocalFile } from '../entities/localFile';
import { Shop } from '../entities/shop';
import ProductModel from '../models/product';
import UploadModel from '../models/upload';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode, ProductEnum } from '../utils/shopp.enum';
import ModelResponse from '../utils/response';

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
    const shopId = req.params.shopId;
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
    body: [
      {
        name: 'name',
        type: String,
      },
      {
        name: 'categoryId',
        type: String,
      },

      {
        name: 'detail',
        type: String,
      },
      {
        name: 'amount',
        type: String,
        validator: (propName: string, value: number) => {
          if (value < 0 || value > 100000000) {
            return `${propName} must be greater than 0 and less than 100000000`;
          }
          return null;
        },
      },
      {
        name: 'quantity',
        type: String,
        validator: (propName: string, value: number) => {
          if (value < 0 || value > 100000) {
            return `${propName} must be greater than 0 and less than 100000`;
          }
          return null;
        },
      },
    ],
  })
  static async postNew(req: Request, res: Response) {
    if (req.files != undefined) {
      const productImages: LocalFile[] = await UploadModel.uploadMultiple(
        req.files
      );

      const data = req.body;
      const shop: Shop = res.locals.user.shop;
      if (shop == null) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .send({ message: 'Can not find shop' });
      }
      const result: ModelResponse = await ProductModel.postNew(
        new EntityManager(ShopPDataSource),
        shop,
        data.name,
        data.categoryId,
        data.detail.toString(),
        data.amount,
        data.quantity,
        ProductEnum.AVAILABLE,
        productImages
      );

      if (result.getCode() === HttpStatusCode.CREATED) {
        res
          .status(result.getCode())
          .send({ message: result.getMessage(), data: result.getData() });
      } else {
        res.status(result.getCode()).send({ message: result.getMessage() });
      }
    } else
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ error: 'Please upload product images' });
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
        name: 'quantity',
        type: String,
        validator: (propName: string, value: number) => {
          if (value < 0 || value > 100000) {
            return `${propName} must be greater than 0 and less than 100000`;
          }
          return null;
        },
      },
      {
        name: 'amount',
        type: String,
        validator: (propName: string, value: number) => {
          if (value < 0 || value > 100000000) {
            return `${propName} must be greater than 0 and less than 100000000`;
          }
          return null;
        },
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
      data.quantity,
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

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
import {
  instanceOfPriceProductFilterRequest,
  instanceOfStarProductFilterRequest,
} from '../utils';

export default class ProductMiddleware {
  @ControllerService()
  static async listAll(req: Request, res: Response) {
    const result = await ProductModel.listAll();
    return res
      .status(HttpStatusCode.OK)
      .send({ total: result.length, data: result });
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
    return res
      .status(HttpStatusCode.OK)
      .send({ total: result.length, data: result });
  }

  @ControllerService()
  static async searchByCategory(req: Request, res: Response) {
    const id = +req.params.categoryId;
    const result = await ProductModel.searchByCategory(id);
    return res
      .status(HttpStatusCode.OK)
      .send({ total: result.length, data: result });
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
    return res
      .status(HttpStatusCode.OK)
      .send({ total: result.length, data: result });
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
    return res
      .status(HttpStatusCode.OK)
      .send({ total: result.length, data: result });
  }

  @ControllerService({
    params: [
      {
        name: 'min',
        type: String,
        validator: (propName: string, value: number) => {
          if (value < 0 || value > 100000000) {
            return `${propName} must be greater than 0 and less than 100000000`;
          }
          return null;
        },
      },
      {
        name: 'max',
        type: String,
        validator: (propName: string, value: number) => {
          if (value < 0 || value > 100000000) {
            return `${propName} must be greater than 0 and less than 100000000`;
          }
          return null;
        },
      },
    ],
  })
  static async filterByPrice(req: Request, res: Response) {
    const max = +req.params.max;
    const min = +req.params.min;
    if (max < min) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'min must be less than max' });
    }
    const result = await ProductModel.filterByPrice(max, min);
    return res
      .status(HttpStatusCode.OK)
      .send({ total: result.length, data: result });
  }

  @ControllerService({
    params: [
      {
        name: 'min',
        type: String,
        validator: (propName: string, value: number) => {
          if (value < 0 || value >= 5) {
            return `${propName} must be from 0 to 5`;
          }
          return null;
        },
      },
      {
        name: 'max',
        type: String,
        validator: (propName: string, value: number) => {
          if (value < 0 || value >= 5) {
            return `${propName} must be from 0 to 5`;
          }
          return null;
        },
      },
    ],
  })
  static async filterByStar(req: Request, res: Response) {
    const max = +req.params.max;
    const min = +req.params.min;
    if (max < min) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'min must be less than max' });
    }
    const result = await ProductModel.filterByStar(max, min);
    return res
      .status(HttpStatusCode.OK)
      .send({ total: result.length, data: result });
  }

  /**
   * @swagger
   * components:
   *  schemas:
   *   FilterProductRequest:
   *    type: object
   *    properties:
   *     take:
   *      type: integer
   *      format: int32
   *      description: limit number of products to be taken.
   *      example: 5
   *     skip:
   *      type: integer
   *      format: int32
   *      description: offset (paginated) from where products should be taken.
   *      example: 0
   *     categoryIds:
   *      type: array
   *      items:
   *       type: integer
   *       format: int32
   *       description: categoryId of product
   *       example: '1'
   *     shopId:
   *      type: string
   *      description: shopId of product
   *      example: 'f191d8ad-3d10-4681-9b14-95d8de1e61e1'
   *     price:
   *      type: object
   *      properties:
   *       min:
   *        type: integer
   *        format: int32
   *        description: min price of product
   *        example: 10000
   *       max:
   *        type: integer
   *        format: int32
   *        description: max price of product
   *        example: 100000
   *       orderBy:
   *        type: string
   *        description: order by price('ASC' or 'DESC')
   *        example: 'ASC'
   *     star:
   *      type: object
   *      properties:
   *       min:
   *        type: integer
   *        format: int32
   *        description: min star of product
   *        example: 1
   *       max:
   *        type: integer
   *        format: int32
   *        description: max star of product
   *        example: 5
   */
  @ControllerService({
    body: [
      {
        name: 'take',
        type: Number,
        required: true,
        validator(propertyName, value) {
          if (!Number.isInteger(value)) {
            return `${propertyName} must be an integer`;
          }
          return null;
        },
      },
      {
        name: 'skip',
        type: Number,
        required: true,
        validator(propertyName, value) {
          if (!Number.isInteger(value)) {
            return `${propertyName} must be an integer`;
          }
          return null;
        },
      },
      {
        name: 'categoryIds',
        required: false,
        validator(propertyName, value) {
          if (
            value !== undefined &&
            !value.every((item: any) => Number.isInteger(item))
          ) {
            return `${propertyName} must be an integer array`;
          }
          return null;
        },
      },
      {
        name: 'price',
        required: false,
        validator(propertyName, value) {
          if (
            value !== undefined &&
            !instanceOfPriceProductFilterRequest(value)
          ) {
            return `${propertyName} must be valid`;
          }
          return null;
        },
      },
      {
        name: 'star',
        required: false,
        validator(propertyName, value) {
          if (
            value !== undefined &&
            !instanceOfStarProductFilterRequest(value)
          ) {
            return `${propertyName} must be valid`;
          }
          return null;
        },
      },
      {
        name: 'shopId',
        required: false,
        validator(propertyName, value) {
          if (value !== undefined && (value == null || value == '')) {
            return `${propertyName} must be String`;
          }
          return null;
        },
      },
    ],
  })
  static async filter(req: Request, res: Response) {
    const take = +req.body.take;
    const skip = +req.body.skip;
    const categoryIds = req.body?.categoryIds ? req.body.categoryIds : null;
    const price = req.body?.price ? req.body.price : null;
    const star = req.body?.star ? req.body.star : null;
    const shopId = req.body?.shopId ? req.body.shopId : null;
    const result = await ProductModel.filter(
      take,
      skip,
      categoryIds,
      price,
      star,
      shopId
    );
    return res
      .status(HttpStatusCode.OK)
      .send({ total: result.length, data: result });
  }

  /**
   * @swagger
   * components:
   *  schemas:
   *   ProductRequest:
   *    type: object
   *    properties:
   *     name:
   *      type: string
   *      description: name of product
   *      example: 'Ao len'
   *     detail:
   *      type: string
   *      description: detail of product
   *      example: 'Dep, ngon, bo, re'
   *     amount:
   *      type: integer
   *      format: int32
   *      description: amount of product
   *      example: '10000'
   *     quantity:
   *      type: integer
   *      format: int32
   *      description: quantity of product
   *      example: '123'
   *     categoryId:
   *      type: integer
   *      format: int32
   *      description: category Id of product
   *      example: '1'
   *     productImages:
   *      type: array
   *      items:
   *       type: string
   *       format: binary
   *       description: images of product
   */
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

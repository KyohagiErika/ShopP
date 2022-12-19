import { Request, Response } from 'express';
import { LocalFile } from '../entities/localFile';
import { Shop } from '../entities/shop';
import { User } from '../entities/user';
import ShopModel from '../models/shop';
import UploadModel from '../models/upload';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode } from '../utils/shopp.enum';

export default class ShopMiddleware {
  @ControllerService()
  static async listAll(req: Request, res: Response) {
    const result = await ShopModel.listAll();
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get shop failed!' });
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
    const result = await ShopModel.getOneById(id);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get shop failed!' });
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
  static async searchShop(req: Request, res: Response) {
    const name = req.params.name;
    const result = await ShopModel.searchShop(name);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get shop failed!' });
    }
  }

  /**
   * @swagger
   * components:
   *  schemas:
   *   ShopRequest:
   *    type: object
   *    properties:
   *     name:
   *      type: string
   *      description: name of shop
   *      example: 'bello'
   *     email:
   *      type: string
   *      description: email of Shop
   *      example: 'buggxx@gmail.com'
   *     phone:
   *      type: string
   *      description: phone of Shop
   *      example: '0912345678'
   *     placeOfReceipt:
   *      type: string
   *      description: place of Receipt of Shop
   *      example: '12 Nguyen Van Linh, Binh Thanh, Ho Chi Minh'
   *     avatar:
   *      type: string
   *      format: binary
   *      description: avatar of Shop
   */
  @ControllerService({
    body: [
      {
        name: 'name',
        type: String,
      },
      {
        name: 'email',
        type: String,
        validator: (propName: string, value: string) => {
          if (!value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
            return `${propName} must be valid email`;
          return null;
        },
      },
      {
        name: 'phone',
        type: String,
        validator: (propName: string, value: string) => {
          if (!value.match(/^(01|03|05|07|08|09)+([0-9]{8})\b/))
            return `${propName} must be valid phone`;
          return null;
        },
      },
      {
        name: 'placeOfReceipt',
        type: String,
      },
    ],
  })
  static async postNew(req: Request, res: Response) {
    if (req.file != undefined) {
      const file = req.file;
      const localFile: LocalFile = await UploadModel.upload(file);
      const user: User = res.locals.user;
      const data = req.body;
      const result = await ShopModel.postNew(
        data.name.toString(),
        localFile,
        user,
        data.email.toString(),
        data.phone.toString(),
        data.placeOfReceipt.toString()
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
        .send({ error: 'Please upload image' });
  }

  @ControllerService({
    body: [
      {
        name: 'name',
        type: String,
      },
      {
        name: 'email',
        type: String,
        validator: (propName: string, value: string) => {
          if (!value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
            return `${propName} must be valid email`;
          return null;
        },
      },
      {
        name: 'phone',
        type: String,
        validator: (propName: string, value: string) => {
          if (!value.match(/^\d{10}$/))
            return `${propName} must be valid phone`;
          return null;
        },
      },
      {
        name: 'placeOfReceipt',
        type: String,
      },
    ],
  })
  static async edit(req: Request, res: Response) {
    if (req.file != undefined) {
      const file = req.file;
      const data = req.body;
      const shop: Shop = res.locals.user.shop;
      const result = await ShopModel.edit(
        shop,
        data.name.toString(),
        file,
        data.email.toString(),
        data.phone.toString(),
        data.placeOfReceipt.toString()
      );
      if (result.getCode() === HttpStatusCode.OK) {
        res
          .status(result.getCode())
          .send({ message: result.getMessage(), data: result.getData() });
      } else {
        res.status(result.getCode()).send({ message: result.getMessage() });
      }
    } else {
      const data = req.body;
      const shop: Shop = res.locals.user.shop;
      const result = await ShopModel.edit(
        shop,
        data.name.toString(),
        null,
        data.email.toString(),
        data.phone.toString(),
        data.placeOfReceipt.toString()
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
}

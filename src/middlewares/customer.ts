import CustomerModel from '../models/customer';
import { Request, Response } from 'express';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode } from '../utils/shopp.enum';
import ConvertDate from '../utils/convertDate';
import { LocalFile } from '../entities/localFile';
import UploadModel from '../models/upload';

export default class CustomerMiddleware {
  @ControllerService()
  static async listAll(req: Request, res: Response) {
    const result = await CustomerModel.listAll();
    if (result) res.status(HttpStatusCode.OK).send({ data: result });
    else
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get customer failed' });
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
    const id = req.params.id.toString();
    const result = await CustomerModel.getOneById(id, res.locals.user);
    res.status(HttpStatusCode.OK).send({ data: res.locals.user });
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Unavailable customer!' });
    }
  }

  @ControllerService({
    body: [
      {
        name: 'name',
        type: String,
        validator: (propName: string, value: string) => {
          if (value.length == 0) return `${propName} must be filled in`;
          return null;
        },
      },
      {
        name: 'gender',
        type: String,
        validator: (propName: string, value: string) => {
          if (value != null) {
            if (
              value.toUpperCase() !== 'MALE' &&
              value.toUpperCase() !== 'FEMALE'
            )
              return `${propName} is only MALE or FEMALE`;
          }
          return null;
        },
      },
      {
        name: 'dob',
        type: String,
        validator: (propName: string, value: string) => {
          if (value.length != 0) {
            if (!Date.parse(ConvertDate(value)))
              return `${propName} is invalid`;
          }
          return null;
        },
      },
      {
        name: 'placeOfDelivery',
        type: String,
        validator: (propName: string, value: string) => {
          if (value.length == 0) return `${propName} must be filled in`;
          return null;
        },
      },
    ],
  })
  static async postNew(req: Request, res: Response) {
    if (req.file != undefined) {
      const file = req.file;
      const localFile: LocalFile = await UploadModel.upload(file);

      const data = req.body;
      // take date
      var dateTrueFormat = ConvertDate(data.dob);
      const result = await CustomerModel.postNew(
        data.name.toString(),
        data.gender,
        new Date(dateTrueFormat),
        data.placeOfDelivery.toString(),
        data.bio,
        res.locals.user,
        localFile
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
        validator: (propName: string, value: string) => {
          if (value.length == 0) return `${propName} must be filled in`;
          return null;
        },
      },
      {
        name: 'gender',
        type: String,
        validator: (propName: string, value: string) => {
          if (
            value.toUpperCase() !== 'MALE' &&
            value.toUpperCase() !== 'FEMALE'
          )
            return `${propName} is only MALE or FEMALE`;
          return null;
        },
      },
      {
        name: 'dob',
        type: String,
        validator: (propName: string, value: string) => {
          if (value.length != 0) {
            if (!Date.parse(ConvertDate(value)))
              return `${propName} is invalid`;
          }

          return null;
        },
      },
      {
        name: 'placeOfDelivery',
        type: String,
        validator: (propName: string, value: string) => {
          if (value.length == 0) return `${propName} must be filled in`;
          return null;
        },
      },
    ],
  })
  static async edit(req: Request, res: Response) {
    if (req.file != undefined) {
      const file = req.file;
      const data = req.body;
      const id = req.params.id;
      // resolve dob
      var dateTrueFormat = ConvertDate(data.dob);
      const result = await CustomerModel.edit(
        data.name,
        data.gender,
        new Date(dateTrueFormat),
        data.placeOfDelivery,
        data.bio,
        res.locals.user,
        file
      );
      res.status(result.getCode()).send({ message: result.getMessage() });
    } else
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ error: 'Please upload image' });
  }

  @ControllerService()
  static async followShop(req: Request, res: Response) {
    const result = await CustomerModel.followShop(
      res.locals.user,
      req.params.shopId
    );
    res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async unollowShop(req: Request, res: Response) {
    const result = await CustomerModel.unfollowShop(
      res.locals.user,
      req.params.shopId
    );
    res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async showFollowedShopsList(req: Request, res: Response) {
    const result = await CustomerModel.showFollowedShopsList(res.locals.user);
    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    else
      res
        .status(result.getCode())
        .send({ message: result.getMessage() });
  }
}

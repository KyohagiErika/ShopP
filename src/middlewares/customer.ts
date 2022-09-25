import { User } from './../entities/user';
import CustomerModel from '../models/customer';
import { Request, Response } from 'express';
import { ControllerService } from '../utils/decorators';
import { GenderEnum, HttpStatusCode } from '../utils/shopp.enum';
import ConvertDate from '../utils/convertDate';

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
    const id = req.params.id;
    const result = await CustomerModel.getOneById(id, res.locals.user);
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
    // console.log(res.locals.user)
    const data = req.body;
    // take date
    var dateTrueFormat = ConvertDate(data.dob);
    const result = await CustomerModel.postNew(
      data.name.toString(),
      data.gender,
      new Date(dateTrueFormat),
      data.placeOfDelivery.toString(),
      res.locals.user
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
    const data = req.body;
    const id = req.params.id;
    // resolve dob
    var dateTrueFormat = ConvertDate(data.dob);
    const result = await CustomerModel.edit(
      data.name,
      data.gender,
      new Date(dateTrueFormat),
      data.placeOfDelivery,
      res.locals.user
    );
    res.status(result.getCode()).send({ message: result.getMessage() });
  }
}

import CustomerModel from '../models/customer';
import { Request, Response } from 'express';
import { ControllerService } from '../utils/decorators';
import { GenderEnum, HttpStatusCode } from '../utils/shopp.enum';

export default class CustomerMiddleware {
  @ControllerService()
  static async listAll(req: Request, res: Response) {
    const result = await CustomerModel.listAll();
    if (result) res.status(HttpStatusCode.OK).send(result);
    else res.status(HttpStatusCode.BAD_REQUEST).send('Get customer failed');
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
    const id = req.params.id; //(req.params as unknown) as number;
    if (id) {
      const result = await CustomerModel.getOneById(id);
      if (result) {
        res.status(HttpStatusCode.OK).send(result);
      } else {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .send('Get customer failed!' + id);
      }
    } else {
      res.status(HttpStatusCode.BAD_REQUEST).send('Incorrect id! ' + id);
    }
  }

  @ControllerService({
    // params: [
    //   {
    //     name: 'userId',
    //     type: Number,
    //     validator: (propName: string, value: string) => {
    //       return null;
    //     },
    //   },
    // ],
    body: [
      {
        name: 'name',
        type: String,
        validator: (propName: string, value: string) => {
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
          var dateReplace = value.replace(/-/g, '/');
          var parts = dateReplace.split('/');
          var dateTrueFormat = `${parts[2]}/${parts[1]}/${parts[0]}`;
          if (!Date.parse(dateTrueFormat)) return `${propName} is invalid`;
          return null;
        },
      },
      {
        name: 'placeOfDelivery',
        type: String,
        validator: (propName: string, value: string) => {
          return null;
        },
      },
    ],
  })
  static async postNew(req: Request, res: Response) {
    const userId = +req.params.userId;
    console.log(userId);
    const data = req.body;

    // take date
    var dateReplace = data.dob.replace(/-/g, '/');
    var parts = dateReplace.split('/');
    var dateTrueFormat = `${parts[2]}/${parts[1]}/${parts[0]}`;
    if (data.name && data.placeOfDelivery && data.gender && dateTrueFormat) {
      const result = await CustomerModel.postNew(
        data.name.toString(),
        data.gender,
        new Date(dateTrueFormat),
        data.placeOfDelivery.toString(),
        userId
      );
      if (result) {
        res.status(HttpStatusCode.OK).send(result);
      } else {
        res.status(HttpStatusCode.BAD_REQUEST).send('Post data failed!');
      }
    } else {
      res.status(HttpStatusCode.BAD_REQUEST).send('Incorrect input data!');
    }
  }

  @ControllerService({
    body: [
      {
        name: 'name',
        type: String,
        validator: (propName: string, value: string) => {
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
          var dateReplace = value.replace(/-/g, '/');
          var parts = dateReplace.split('/');
          var dateTrueFormat = `${parts[2]}/${parts[1]}/${parts[0]}`;
          if (!Date.parse(dateTrueFormat)) return `${propName} is invalid`;
          return null;
        },
      },
      {
        name: 'placeOfDelivery',
        type: String,
        validator: (propName: string, value: string) => {
          return null;
        },
      },
    ],
  })
  static async edit(req: Request, res: Response) {
    const data = req.query;
    const id = req.params.id;

    if (id && data.name && data.placeOfDelivery && data.dob && data.gender) {
      // resolve gender
      let gender: GenderEnum;
      if (data.gender.toString().toUpperCase() === 'FEMALE') {
        gender = GenderEnum.FEMALE;
      } else {
        gender = GenderEnum.MALE;
      }

      // resolve dob
      var dateReplace = data.dob.toString().replace(/-/g, '/');
      var parts = dateReplace.split('/');
      var dateTrueFormat = `${parts[2]}/${parts[1]}/${parts[0]}`;

      const result = await CustomerModel.edit(
        id.toString(),
        data.name.toString(),
        gender,
        new Date(dateTrueFormat),
        data.placeOfDelivery.toString()
      );
      if (result) {
        res.status(HttpStatusCode.OK).send(result);
      } else {
        res.status(HttpStatusCode.BAD_REQUEST).send('Insert data failed!');
      }
    } else {
      res.status(HttpStatusCode.BAD_REQUEST).send('Incorrect input data!');
    }
  }
}

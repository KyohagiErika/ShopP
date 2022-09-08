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
        type: String
      }
      
    ]
  })
  static async getOneById(req: Request, res: Response) {
    const id = req.params.id; //(req.params as unknown) as number;
    if (id) {
      const result = await CustomerModel.getOneById(id);
      if (result) {
        res.status(HttpStatusCode.OK).send(result);
      } else {
        res.status(HttpStatusCode.BAD_REQUEST).send('Get customer failed!' + id);
      }
    } else {
      res.status(HttpStatusCode.BAD_REQUEST).send('Incorrect id! ' + id);
    }
  }

  @ControllerService()
  static async postNew(req: Request, res: Response) {
    const userid = +req.params
    const data = req.body;
    if (data.name && data.placeOfDelivery) {
      const result = await CustomerModel.postNew(
        data.name.toString(),
        data.gender,
        data.dob,
        data.placeOfDelivery.toString(),
        userid,
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

  @ControllerService()
  static async edit(req: Request, res: Response) {
    const data = req.query;
    const id = req.params;
    if (id && data.name && data.placeOfDelivery && data.dob && data.gender) {
      let gender: GenderEnum;
      if (data.gender.toString().toUpperCase() === 'FEMALE') {
        gender = GenderEnum.FEMALE;
      } else {
        gender = GenderEnum.MALE;
      }
      const result = await CustomerModel.edit(
        id.id.toString(),
        data.name.toString(),
        gender,
        new Date(data.dob.toString()),
        data.placeOfDelivery.toString()
      );
      if (result) {
        res.send(result);
      } else {
        res.status(400).send('Insert data failed!');
      }
    } else {
      res.status(400).send('Incorrect input data!');
    }
  }
}

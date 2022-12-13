import { HttpStatusCode, VoucherTypeEnum } from './../utils/shopp.enum';
import { Response, Request } from 'express';
import VoucherModel from '../models/voucher';
import { ControllerService } from '../utils/decorators';
import ConvertDate from '../utils/convertDate';

export default class VoucherMiddleware {
  @ControllerService()
  static async listAll(req: Request, res: Response) {
    const result = await VoucherModel.listAll();
    if (result) res.status(HttpStatusCode.OK).send({ data: result });
    else
      res.status(HttpStatusCode.OK).send({ message: 'No vouchers available' });
  }

  @ControllerService()
  static async listAppVouchers(req: Request, res: Response) {
    const result = await VoucherModel.listAppVouchers();
    if (result) res.status(HttpStatusCode.OK).send({ data: result });
    else
      res.status(HttpStatusCode.OK).send({ message: 'No vouchers available' });
  }

  @ControllerService()
  static async listShopVouchers(req: Request, res: Response) {
    const result = await VoucherModel.listShopVouchers();
    if (result) res.status(HttpStatusCode.OK).send({ data: result });
    else
      res.status(HttpStatusCode.OK).send({ message: 'No vouchers available' });
  }

  @ControllerService()
  static async getOneById(req: Request, res: Response) {
    const id = req.params.id;
    const result = await VoucherModel.getOneById(id);
    if (result) res.status(HttpStatusCode.OK).send({ data: result });
    else
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Unavailable voucher' });
  }

  @ControllerService({
    body: [
      {
        name: 'title',
        type: String,
        validator: (propName: string, value: string) => {
          if (value.length == 0) return `${propName} must be filled in`;
          return null;
        },
      },
      {
        name: 'type',
        type: String,
        validator: (propName: string, value: string) => {
          if (
            value.toUpperCase() !== 'MONEY' &&
            value.toUpperCase() !== 'FREESHIP' &&
            value.toUpperCase() !== 'PERCENT'
          )
            return `${propName} is invalid. Only MONEY, FREESHIP OR PERCENT!`;
          return null;
        },
      },
      {
        name: 'amount',
        validator: (propName: string, value: string) => {
          const number = Number(value);
          if (!number) return `${propName} must be a number`;
          return null;
        },
      },
      {
        name: 'mfgDate',
        type: String,
        validator: (propName: string, value: string) => {
          if (!Date.parse(ConvertDate(value))) return `${propName} is invalid`;
          return null;
        },
      },
      {
        name: 'expDate',
        type: String,
        validator: (propName: string, value: string) => {
          if (!Date.parse(ConvertDate(value))) return `${propName} is invalid`;
          return null;
        },
      },
    ],
  })
  static async editVoucher(req: Request, res: Response) {
    const id = req.params.id;
    const data = req.body;
    const mfgDate = new Date(ConvertDate(data.mfgDate));
    const expDate = new Date(ConvertDate(data.expDate));
    const now = new Date();
    if (now >= mfgDate) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'mfgDate must be after today!' });
      return;
    }
    if (mfgDate > expDate) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'mfgDate must be smaller than expDate!' });
      return;
    }
    const result = await VoucherModel.editVoucher(
      res.locals.user,
      id,
      data.title,
      data.type,
      data.amount,
      data.condition,
      mfgDate,
      expDate
    );
    res.status(result.getCode()).send({ message: result.getMessage() });
  }

  /**
   * @swagger
   * components:
   *  schemas:
   *   VoucherRequest:
   *    type: object
   *    properties:
   *     title:
   *      type: string
   *      description: title of voucher
   *      example: Tat ca hinh thuc thanh toan
   *     type:
   *      type: string
   *      description: type of voucher
   *      example: Freeship
   *     amount:
   *      type: int
   *      description: amount of voucher
   *      example: 100
   *     condition:
   *      type: string
   *      description: type of voucher
   *      example: Freeship
   *     mfgDate:
   *      type: string
   *      description: start day of voucher
   *      example: 1-1-2023
   *     expDate:
   *      type: string
   *      description: expire day of voucher
   *      example: 2-2-2023
   */
  @ControllerService({
    body: [
      {
        name: 'title',
        type: String,
        validator: (propName: string, value: string) => {
          if (value.length == 0) return `${propName} must be filled in`;
          return null;
        },
      },
      {
        name: 'type',
        type: String,
        validator: (propName: string, value: string) => {
          if (
            value.toUpperCase() !== 'MONEY' &&
            value.toUpperCase() !== 'FREESHIP' &&
            value.toUpperCase() !== 'PERCENT'
          )
            return `${propName} is invalid. Only MONEY, FREESHIP OR PERCENT!`;
          return null;
        },
      },
      {
        name: 'amount',
        validator: (propName: string, value: string) => {
          const number = Number(value);
          if (!number) return `${propName} must be a number`;
          return null;
        },
      },
      {
        name: 'mfgDate',
        type: String,
        validator: (propName: string, value: string) => {
          if (!Date.parse(ConvertDate(value))) return `${propName} is invalid`;
          return null;
        },
      },
      {
        name: 'expDate',
        type: String,
        validator: (propName: string, value: string) => {
          if (!Date.parse(ConvertDate(value))) return `${propName} is invalid`;
          return null;
        },
      },
    ],
  })
  static async newVoucher(req: Request, res: Response) {
    const data = req.body;
    const mfgDate = new Date(ConvertDate(data.mfgDate));
    const expDate = new Date(ConvertDate(data.expDate));
    const now = new Date();
    if (now >= mfgDate) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'mfgDate must be after today!' });
      return;
    }
    if (mfgDate > expDate) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'mfgDate must be smaller than expDate!' });
      return;
    }
    const result = await VoucherModel.newVoucher(
      res.locals.user,
      data.title,
      data.type,
      data.amount,
      data.condition,
      mfgDate,
      expDate
    );
    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async deleteVoucher(req: Request, res: Response) {
    const id = req.params.id;
    const result = await VoucherModel.deleteVoucher(res.locals.user, id);
    res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async saveVoucher(req: Request, res: Response) {
    const id = req.params.id;
    const result = await VoucherModel.saveVoucher(res.locals.user, id);
    res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async showCustomerAppVouchers(req: Request, res: Response) {
    const result = await VoucherModel.showCustomerAppVouchers(res.locals.user);
    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async showCustomerShopVouchers(req: Request, res: Response) {
    const result = await VoucherModel.showCustomerShopVouchers(res.locals.user);
    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async showCustomerFreeshipVouchers(req: Request, res: Response) {
    const result = await VoucherModel.showCustomerFreeshipVouchers(
      res.locals.user
    );
    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async showCustomerDiscountVouchers(req: Request, res: Response) {
    const result = await VoucherModel.showCustomerDiscountVouchers(
      res.locals.user
    );
    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async deleteCustomerVoucher(req: Request, res: Response) {
    const result = await VoucherModel.deleteCustomerVoucher(
      res.locals.user,
      req.params.id
    );
    res.status(result.getCode()).send({ message: result.getMessage() });
  }
}

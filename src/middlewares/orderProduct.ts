import { Request, Response } from 'express';
import orderProductModel from '../models/orderProduct';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode } from '../utils/shopp.enum';

export default class OrderProductMiddleware {
  @ControllerService()
  static async viewShopOrderProduct(req: Request, res: Response) {
    const shop = res.locals.user.shop;
    const orderNumber = req.params.id;
    const result = await orderProductModel.viewShopOrderProduct(
      orderNumber,
      shop
    );
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get order product failed!' });
    }
  }

  static async viewCustomerOrderProduct(req: Request, res: Response) {
    const customer = res.locals.user.customer;
    const orderNumber = req.params.id;
    const result = await orderProductModel.viewCustomerOrderProduct(
      orderNumber,
      customer
    );
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get order product failed!' });
    }
  }
}

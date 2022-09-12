import CartModel from '../models/cart';
import { Request, Response } from 'express';
import { ControllerService } from '../utils/decorators';
import { GenderEnum, HttpStatusCode } from '../utils/shopp.enum';

export default class CartMiddleware {
  @ControllerService()
  static async showCart(req: Request, res: Response) {
    const id = +req.params.id;
    const result = await CartModel.showCart(id);
    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(HttpStatusCode.OK)
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async postNew(req: Request, res: Response) {
    const data = req.body;
    const customerId = data.customerId;
    const products = data.products;
    const result = await CartModel.postNew(customerId, products);
    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ data: result.getData() });
  }
}

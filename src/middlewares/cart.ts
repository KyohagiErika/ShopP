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

}

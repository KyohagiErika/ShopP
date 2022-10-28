import CartModel from '../models/cart';
import { Request, Response } from 'express';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode } from '../utils/shopp.enum';

export default class CartMiddleware {
  @ControllerService()
  static async showCart(req: Request, res: Response) {
    const cartId = +req.params.cartId;
    const result = await CartModel.showCart(cartId);
    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(HttpStatusCode.OK)
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async postNew(req: Request, res: Response) {
    const result = await CartModel.postNew(res.locals.user);
    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(HttpStatusCode.OK)
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async update(req: Request, res: Response) {
    const result = await CartModel.update(+req.params.cartId, req.body.products);
    res.status(result.getCode()).send({ message: result.getMessage() });
  }
}

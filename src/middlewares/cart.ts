import CartModel from '../models/cart';
import { Request, Response } from 'express';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode } from '../utils/shopp.enum';

export default class CartMiddleware {
  @ControllerService()
  static async showCart(req: Request, res: Response) {
    const result = await CartModel.showCart(res.locals.user);
    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(HttpStatusCode.OK)
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  /**
   * @swagger
   * components:
   *  schemas:
   *    CartRequest:
   *     type: object
   *     properties:
   *      products:
   *       type: string
   *       description: products of cart
   *       example: '[{id: 1234, name: "ao quan", amount: 5, color: "red" }, {id: 1234, name: "ao quan", amount: 5, color: "blue" }]'
   */
  @ControllerService()
  static async update(req: Request, res: Response) {
    const result = await CartModel.update(res.locals.user, req.body.products);
    res.status(result.getCode()).send({ message: result.getMessage() });
  }
}

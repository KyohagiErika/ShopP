import orderModel from '../models/order';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode } from '../utils/shopp.enum';
import { Request, Response } from 'express';
import shopModel from '../models/shop';
import TransportFeeModel from '../models/transportFee';

export default class TransportFeeMiddleware {
  @ControllerService({
    params: [
      {
        name: 'shopId',
        type: String,
        required: true,
      },
    ],
  })
  static async getTransportFee(req: Request, res: Response) {
    const shopId = req.params.shopId;
    const shop = await shopModel.getOneById(shopId);
    if (shop == false)
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .send({ message: 'Shop not found' });

    const customer = res.locals.user.customer;
    const placeOfDelivery = req.params.placeOfDelivery;
    if (!customer.placeOfDelivery.includes(placeOfDelivery)) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: "Invalid customer's place of delivery" });
    }

    const result = await TransportFeeModel.getTransportFee(
      shop.placeOfReceipt,
      placeOfDelivery
    );
    if (result.getCode() == HttpStatusCode.OK)
      return res
        .status(HttpStatusCode.OK)
        .send({ message: result.getMessage(), data: result.getData() });
    return res
      .status(HttpStatusCode.BAD_REQUEST)
      .send({ message: result.getMessage() });
  }

  @ControllerService({
    params: [
      {
        name: 'address',
        type: String,
        required: true,
      },
    ],
  })
  static async validAddress(req: Request, res: Response) {
    const shopId = req.params.address;
    const result = await TransportFeeModel.validAddress(shopId);
    return res.status(result.getCode()).send({ message: result.getMessage() });
  }
}

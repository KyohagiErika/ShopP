import { Request, Response } from 'express';
import { Customer } from '../entities/customer';
import { Shop } from '../entities/shop';
import { OrderRequest } from '../interfaces/order';
import orderModel from '../models/order';
import io from '../socket';
import { instanceOfOrderRequest } from '../utils';
import { ControllerService } from '../utils/decorators';
import { DeliveryStatusEnum, HttpStatusCode } from '../utils/shopp.enum';

export default class OrderMiddleware {
  @ControllerService()
  static async viewOrderForCustomer(req: Request, res: Response) {
    const customer: Customer = res.locals.user.customer;
    if (customer == null) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Can not find customer !' });
    }
    const result = await orderModel.viewOrderForCustomer(customer);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get order list failed !' });
    }
  }

  static async viewOrderDeliverForCus(req: Request, res: Response) {
    const customer: Customer = res.locals.user.customer;
    if (customer == null) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Can not find customer !' });
    }
    const result = await orderModel.viewOrderDeliverForCus(customer);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get order list failed !' });
    }
  }

  static async viewHistoryForCus(req: Request, res: Response) {
    const customer: Customer = res.locals.user.customer;
    if (customer == null) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Can not find customer !' });
    }
    const result = await orderModel.viewHistoryForCus(customer);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get order list failed !' });
    }
  }

  static async viewCancelOrderForCus(req: Request, res: Response) {
    const customer: Customer = res.locals.user.customer;
    if (customer == null) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Can not find customer !' });
    }
    const result = await orderModel.viewCancelOrderForCus(customer);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get order list failed !' });
    }
  }

  static async viewOrderForShop(req: Request, res: Response) {
    const shop: Shop = res.locals.user.shop;
    if (shop == null) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Can not find shop !' });
    }
    const result = await orderModel.viewOrderForShop(shop);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get order list failed !' });
    }
  }

  static async viewConfirmOrderForShop(req: Request, res: Response) {
    const shop: Shop = res.locals.user.shop;
    if (shop == null) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Can not find shop !' });
    }
    const result = await orderModel.viewConfirmOrderForShop(shop);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get order list failed !' });
    }
  }

  static async viewOrderDeliverForShop(req: Request, res: Response) {
    const shop: Shop = res.locals.user.shop;
    if (shop == null) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Can not find shop !' });
    }
    const result = await orderModel.viewOrderDeliverForShop(shop);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get order list failed !' });
    }
  }

  static async viewHistoryForShop(req: Request, res: Response) {
    const shop: Shop = res.locals.user.shop;
    if (shop == null) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Can not find shop !' });
    }
    const result = await orderModel.viewHistoryForShop(shop);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Get order list failed !' });
    }
  }

  /**
   * @swagger
   * components:
   *  schemas:
   *   OrderRequest:
   *    type: object
   *    properties:
   *     address:
   *      type: string
   *      description: address of delivery
   *      example: 'Thu Duc, Ho Chi Minh City'
   *     paymentId:
   *      type: number
   *      format: int64
   *      description: paymentId of payment
   *      example: '2'
   *     orders:
   *      type: array
   *      items:
   *       $ref: '#/components/schemas/OrderItemRequest'
   *   OrderItemRequest:
   *    type: object
   *    properties:
   *     estimateDeliveryTime:
   *      type: string
   *      description: estimate delivery time of order
   *      example: '12/12/2022-15/12/2022'
   *     transportFee:
   *      type: number
   *      format: int64
   *      description: transport fee of order
   *      example: '10000'
   *     shoppingUnitId:
   *      type: number
   *      format: int64
   *      description: shopping unit id
   *      example: '1'
   *     voucherIds:
   *      type: array
   *      items:
   *       type: string
   *      example: ['f191d8ad-3d10-4681-9b14-95d8de1e61e1', 'f191d8ad-3d10-4681-9b14-95d8de1e61e1']
   *     shopId:
   *      type: string
   *      format: uuid
   *      description: shop id
   *      example: 'f191d8ad-3d10-4681-9b14-95d8de1e61e1'
   *     orderProducts:
   *      type: array
   *      items:
   *       $ref: '#/components/schemas/OrderProductRequest'
   *   OrderProductRequest:
   *    type: object
   *    properties:
   *     productId:
   *      type: string
   *      format: uuid
   *      description: product id
   *      example: 'f191d8ad-3d10-4681-9b14-95d8de1e61e1'
   *     price:
   *      type: number
   *      format: int64
   *      description: price of product
   *      example: '100000'
   *     quantity:
   *      type: number
   *      format: int64
   *      description: quantity of product
   *      example: '1'
   *     additionalInfo:
   *      type: string
   *      format: uuid
   *      description: additional info of product
   *      example: 'no sugar'
   */
  @ControllerService({
    body: [
      {
        name: 'address',
        type: String,
      },
      {
        name: 'paymentId',
        type: Number,
      },
      {
        name: 'orders',
        type: Array,
        validator(propertyName, value) {
          if (!value.every(instanceOfOrderRequest)) {
            return `${propertyName} must be valid order request`;
          }
          return null;
        },
      },
    ],
  })
  static async postNew(req: Request, res: Response) {
    const customer = res.locals.user.customer;
    if (customer == null) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Can not find customer !' });
    }
    const data = req.body;
    let orders: OrderRequest[] = [];
    try {
      orders = data.orders as OrderRequest[];
    } catch (error) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Invalid order data !' });
    }

    const result = await orderModel.postNew(
      data.address.toString(),
      data.paymentId,
      orders,
      customer
    );
    if (result.getCode() === HttpStatusCode.OK) {
      // //send notification
      // io.to(res.locals.user.id.toString).emit("customer-notification", result.getData())
      // io.to(res.locals.user.id.toString).emit("shop-notification", result.getData())

      return res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    } else {
      return res
        .status(result.getCode())
        .send({ message: result.getMessage() });
    }
  }

  @ControllerService({
    body: [
      {
        name: 'deliveryStatus',
        type: String,
        validator: (propName: string, value: string) => {
          if (
            value.toUpperCase() !== 'CONFIRMED' &&
            value.toUpperCase() !== 'PACKAGING' &&
            value.toUpperCase() !== 'DELIVERING' &&
            value.toUpperCase() !== 'DELIVERED'
          )
            return `${propName} is not correct`;
          return null;
        },
      },
    ],
  })
  static async editDeliveryStatus(req: Request, res: Response) {
    const id = req.params.id;
    const data = req.body;
    let deliveryStatus: DeliveryStatusEnum;
    if (data.deliveryStatus.toString().toUpperCase() === 'CONFIRMED') {
      deliveryStatus = DeliveryStatusEnum.CONFIRMED;
    } else if (data.deliveryStatus.toString().toUpperCase() === 'PACKAGING') {
      deliveryStatus = DeliveryStatusEnum.PACKAGING;
    } else if (data.deliveryStatus.toString().toUpperCase() === 'DELIVERING') {
      deliveryStatus = DeliveryStatusEnum.DELIVERING;
    } else {
      deliveryStatus = DeliveryStatusEnum.DELIVERED;
    }

    const result = await orderModel.editDeliveryStatus(id, deliveryStatus);
    if (result) {
      res.status(result.getCode()).send({ message: result.getMessage() });
    }
  }

  @ControllerService()
  static async cancelOrder(req: Request, res: Response) {
    const id = req.params.id;
    const result = await orderModel.cancelOrder(id);
    if (result) {
      res.status(result.getCode()).send({ message: result.getMessage() });
    }
  }
}

import { Request, Response } from 'express';
import { Customer } from '../entities/customer';
import { Shop } from '../entities/shop';
import { User } from '../entities/user';
import { OrderRequest } from '../interfaces/order';
import orderModel from '../models/order';
import trackingOrderModel from '../models/trackingOrder';
import {
  enumObject,
  getValueByKeyEnum,
  instanceOfOrderRequest,
} from '../utils';
import { ControllerService } from '../utils/decorators';
import {
  DeliveryStatusEnum,
  HttpStatusCode,
  RoleEnum,
  TitleStatusEnum,
} from '../utils/shopp.enum';

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
    res.status(HttpStatusCode.OK).send({ data: result });
  }

  @ControllerService()
  static async viewOrderDeliverForCus(req: Request, res: Response) {
    const customer: Customer = res.locals.user.customer;
    if (customer == null) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Can not find customer !' });
    }
    const result = await orderModel.viewOrderDeliverForCus(customer);
    res.status(HttpStatusCode.OK).send({ data: result });
  }

  @ControllerService()
  static async viewHistoryForCus(req: Request, res: Response) {
    const customer: Customer = res.locals.user.customer;
    if (customer == null) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Can not find customer !' });
    }
    const result = await orderModel.viewHistoryForCus(customer);
    res.status(HttpStatusCode.OK).send({ data: result });
  }

  @ControllerService()
  static async viewCancelOrderForCus(req: Request, res: Response) {
    const customer: Customer = res.locals.user.customer;
    if (customer == null) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Can not find customer !' });
    }
    const result = await orderModel.viewCancelOrderForCus(customer);
    res.status(HttpStatusCode.OK).send({ data: result });
  }

  @ControllerService()
  static async viewOrderForShop(req: Request, res: Response) {
    const shop: Shop = res.locals.user.shop;
    if (shop == null) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Can not find shop !' });
    }
    const result = await orderModel.viewOrderForShop(shop);
    res.status(HttpStatusCode.OK).send({ data: result });
  }

  @ControllerService()
  static async viewConfirmOrderForShop(req: Request, res: Response) {
    const shop: Shop = res.locals.user.shop;
    if (shop == null) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Can not find shop !' });
    }
    const result = await orderModel.viewConfirmOrderForShop(shop);
    res.status(HttpStatusCode.OK).send({ data: result });
  }

  @ControllerService()
  static async viewOrderDeliverForShop(req: Request, res: Response) {
    const shop: Shop = res.locals.user.shop;
    if (shop == null) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Can not find shop !' });
    }
    const result = await orderModel.viewOrderDeliverForShop(shop);
    res.status(HttpStatusCode.OK).send({ data: result });
  }

  @ControllerService()
  static async viewHistoryForShop(req: Request, res: Response) {
    const shop: Shop = res.locals.user.shop;
    if (shop == null) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Can not find shop !' });
    }
    const result = await orderModel.viewHistoryForShop(shop);
    res.status(HttpStatusCode.OK).send({ data: result });
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
   *     appVoucherId:
   *      type: string
   *      format: uuid
   *      description: id of app voucher
   *      example: 'f191d8ad-3d10-4681-9b14-95d8de1e61e1'
   *     freeShipVoucherId:
   *      type: string
   *      format: uuid
   *      description: id of freeship voucher
   *      example: 'f191d8ad-3d10-4681-9b14-95d8de1e61e1'
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
   *     shopVoucherId:
   *      type: string
   *      format: uuid
   *      description: id of shop voucher
   *      example: 'f191d8ad-3d10-4681-9b14-95d8de1e61e1'
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
   *     quantity:
   *      type: number
   *      format: int64
   *      description: quantity of product
   *      example: '1'
   *     additionalInfo:
   *      type: string
   *      format: uuid
   *      description: additional info of product
   *      example: 'size: M, color: red'
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
        name: 'appVoucherId',
        type: String,
      },
      {
        name: 'freeShipVoucherId',
        type: String,
      },
      {
        name: 'orders',
        type: Array,
        validator(propertyName, value) {
          if (value.length > 0 && !value.every(instanceOfOrderRequest)) {
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

    const appVoucherId =
      req.body.appVoucherId != null && req.body?.appVoucherId != ''
        ? req.body.appVoucherId
        : null;

    const freeShipVoucherId =
      req.body.freeShipVoucherId != null && req.body?.freeShipVoucherId != ''
        ? req.body.freeShipVoucherId
        : null;

    const result = await orderModel.postNew(
      data.address.toString(),
      data.paymentId,
      orders,
      customer,
      appVoucherId,
      freeShipVoucherId
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

  /**
   * @swagger
   * components:
   *  schemas:
   *   EditOrderRequest:
   *    type: object
   *    properties:
   *     title:
   *      $ref: '#/components/schemas/TitleStatusEnum'
   *     deliveryStatus:
   *      $ref: '#/components/schemas/DeliveryStatusEnum'
   *     location:
   *      type: string
   *      description: location of package
   *      example: 'Ho Chi Minh city'
   */
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
      {
        name: 'title',
        type: String,
        validator: (propName: string, value: string) => {
          if (
            value.toUpperCase() !== 'ORDER_IS_REPARING' &&
            value.toUpperCase() !== 'ORDER_READY_TO_BE_SEND' &&
            value.toUpperCase() !== 'ORDER_HAS_ARRIVED_TO_STATION_1' &&
            value.toUpperCase() !== 'ORDER_HAS_ARRIVED_TO_STATION_2' &&
            value.toUpperCase() !== 'ORDER_HAS_ARRIVED_TO_STATION_3' &&
            value.toUpperCase() !== 'ORDER_IS_BEING_DELIVERY_TO_YOU' &&
            value.toUpperCase() !== 'DELIVERY_COMPLETED'
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
    const shop: Shop = res.locals.user.shop;
    const checkOrder = await orderModel.getOne(id);
    if (checkOrder == false) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Order not found' });
    } else {
      if (!(checkOrder.shop.id == shop.id)) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .send({ message: 'Only edit your order' });
      }
    }

    const deliveryObj = enumObject(DeliveryStatusEnum);
    const titleObj = enumObject(TitleStatusEnum);

    let deliveryStatus = data.deliveryStatus.toUpperCase();
    if (!deliveryObj.includes(deliveryStatus.toString())) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Delivery status is not correct' });
    }
    const newDeliveryStatus = getValueByKeyEnum(
      DeliveryStatusEnum,
      deliveryStatus
    );

    let title = data.title.toUpperCase();
    if (!titleObj.includes(title.toString())) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Title is not correct' });
    }
    const newTitle = getValueByKeyEnum(TitleStatusEnum, title);

    const result1 = await orderModel.editDeliveryStatus(
      id,
      newDeliveryStatus,
      newTitle
    );

    if (result1.getCode() !== HttpStatusCode.OK) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({
        message: result1.getMessage(),
      });
    } else {
      const result2 = await trackingOrderModel.postNew(
        id,
        newTitle,
        newDeliveryStatus,
        data.location
      );
      if (
        result1.getCode() === HttpStatusCode.OK &&
        result2.getCode() === HttpStatusCode.CREATED
      ) {
        return res.status(result2.getCode()).send({
          message: result2.getMessage(),
          data: result2.getData(),
        });
      } else {
        return res.status(HttpStatusCode.BAD_REQUEST).send({
          message: result2.getMessage(),
        });
      }
    }
  }

  @ControllerService()
  static async cancelOrder(req: Request, res: Response) {
    const id = req.params.id;
    const data = req.body;
    const user: User = res.locals.user;
    let title: TitleStatusEnum;
    if (user.role.role == RoleEnum.CUSTOMER) {
      const checkOrder = await orderModel.getOne(id);
      if (checkOrder == false) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .send({ message: 'Order not found' });
      } else {
        if (!(checkOrder.customer.id == user.customer.id)) {
          return res
            .status(HttpStatusCode.BAD_REQUEST)
            .send({ message: 'Only cancel your order' });
        } else {
          title = TitleStatusEnum.ORDER_IS_CANCELLED_BY_CUSTOMER;
        }
      }
    } else {
      const checkOrder = await orderModel.getOne(id);
      if (checkOrder == false) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .send({ message: 'Order not found' });
      } else {
        if (!(checkOrder.shop.id == user.shop.id)) {
          return res
            .status(HttpStatusCode.BAD_REQUEST)
            .send({ message: 'Only cancel your order' });
        } else {
          title = TitleStatusEnum.ORDER_IS_CANCELLED_BY_SHOP;
        }
      }
    }
    const result1 = await orderModel.cancelOrder(id, title);
    if (result1.getCode() !== HttpStatusCode.OK) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({
        message: result1.getMessage(),
      });
    } else {
      const result2 = await trackingOrderModel.postNew(
        id,
        title,
        DeliveryStatusEnum.CANCELLED,
        data.location
      );
      if (
        result1.getCode() === HttpStatusCode.OK &&
        result2.getCode() === HttpStatusCode.CREATED
      ) {
        return res.status(result2.getCode()).send({
          message: result2.getMessage(),
          data: result2.getData(),
        });
      } else {
        return res.status(HttpStatusCode.BAD_REQUEST).send({
          message: result2.getMessage(),
        });
      }
    }
  }

  /**
   * @swagger
   * components:
   *  schemas:
   *   ReturnOrderRequest:
   *    type: object
   *    properties:
   *     location:
   *      type: string
   *      description: location of package
   *      example: 'Ho Chi Minh city'
   */
  @ControllerService()
  static async returnOrder(req: Request, res: Response) {
    const id = req.params.id;
    const data = req.body;
    const user: User = res.locals.user;
    let title: TitleStatusEnum;
    if (user.role.role == RoleEnum.CUSTOMER) {
      const checkOrder = await orderModel.getOne(id);
      if (checkOrder == false) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .send({ message: 'Order not found' });
      } else {
        if (!(checkOrder.customer.id == user.customer.id)) {
          return res
            .status(HttpStatusCode.BAD_REQUEST)
            .send({ message: 'Only return your order' });
        } else {
          title = TitleStatusEnum.ORDER_IS_RETURN_TO_SHOP_BY_CUSTOMER;
        }
      }
    } else {
      const checkOrder = await orderModel.getOne(id);
      if (checkOrder == false) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .send({ message: 'Order not found' });
      } else {
        if (!(checkOrder.shop.id == user.shop.id)) {
          return res
            .status(HttpStatusCode.BAD_REQUEST)
            .send({ message: 'Only return your order' });
        } else {
          title = TitleStatusEnum.ORDER_IS_RETURN_BY_DELEVERY_UNSUCCESSFULLY;
        }
      }
    }
    const result1 = await orderModel.returnOrder(id, title);
    if (result1.getCode() !== HttpStatusCode.OK) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({
        message: result1.getMessage(),
      });
    } else {
      const result2 = await trackingOrderModel.postNew(
        id,
        title,
        DeliveryStatusEnum.RETURNED,
        data.location
      );
      if (
        result1.getCode() === HttpStatusCode.OK &&
        result2.getCode() === HttpStatusCode.CREATED
      ) {
        return res.status(result2.getCode()).send({
          message: result2.getMessage(),
          data: result2.getData(),
        });
      } else {
        return res.status(HttpStatusCode.BAD_REQUEST).send({
          message: result2.getMessage(),
        });
      }
    }
  }
}

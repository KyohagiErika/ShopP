import { ShopPDataSource } from '../data';
import { Customer } from '../entities/customer';
import { OrderProduct } from '../entities/orderProduct';
import { Order } from '../entities/order';
import { Payment } from '../entities/payment';
import { Product } from '../entities/product';
import { Shop } from '../entities/shop';
import { ShoppingUnit } from '../entities/shoppingUnit';
import { Voucher } from '../entities/voucher';
import Response from '../utils/response';
import {
  DeliveryStatusEnum,
  HttpStatusCode,
  StatusEnum,
} from '../utils/shopp.enum';
import { OrderRequest } from '../interfaces/order';
import { In } from 'typeorm';

const orderReposity = ShopPDataSource.getRepository(Order);
const shopReposity = ShopPDataSource.getRepository(Shop);
const paymentReposity = ShopPDataSource.getRepository(Payment);
const shoppingUnitReposity = ShopPDataSource.getRepository(ShoppingUnit);
const voucherReposity = ShopPDataSource.getRepository(Voucher);
const productRepository = ShopPDataSource.getRepository(Product);

export default class orderModel {
  static async viewOrderForCustomer(customer: Customer) {
    const order = await orderReposity.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        shop: true,
      },
      where: [
        {
          customer: { id: customer.id },
          status: StatusEnum.ACTIVE,
          deliveryStatus: DeliveryStatusEnum.CHECKING,
        },
        {
          customer: { id: customer.id },
          status: StatusEnum.ACTIVE,
          deliveryStatus: DeliveryStatusEnum.CONFIRMED,
        },
        {
          customer: { id: customer.id },
          status: StatusEnum.ACTIVE,
          deliveryStatus: DeliveryStatusEnum.PACKAGING,
        },
      ],
    });
    return order ? order : false;
  }

  static async viewOrderForShop(shop: Shop) {
    const order = await orderReposity.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        customer: true,
      },
      where: {
        shop: { id: shop.id },
        status: StatusEnum.ACTIVE,
        deliveryStatus: DeliveryStatusEnum.CHECKING,
      },
    });
    return order ? order : false;
  }

  static async viewConfirmOrderForShop(shop: Shop) {
    const order = await orderReposity.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        customer: true,
      },
      where: [
        {
          shop: { id: shop.id },
          status: StatusEnum.ACTIVE,
          deliveryStatus: DeliveryStatusEnum.CONFIRMED,
        },
        {
          shop: { id: shop.id },
          status: StatusEnum.ACTIVE,
          deliveryStatus: DeliveryStatusEnum.PACKAGING,
        },
      ],
    });
    return order ? order : false;
  }

  static async viewOrderDeliverForCus(customer: Customer) {
    const order = await orderReposity.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        shop: true,
      },

      where: {
        customer: { id: customer.id },
        status: StatusEnum.ACTIVE,
        deliveryStatus: DeliveryStatusEnum.DELIVERING,
      },
    });
    return order ? order : false;
  }

  static async viewOrderDeliverForShop(shop: Shop) {
    const order = await orderReposity.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        customer: true,
      },
      where: {
        shop: { id: shop.id },
        status: StatusEnum.ACTIVE,
        deliveryStatus: DeliveryStatusEnum.DELIVERING,
      },
    });
    return order ? order : false;
  }

  static async viewHistoryForCus(customer: Customer) {
    const order = await orderReposity.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        shop: true,
      },
      where: {
        customer: { id: customer.id },
        status: StatusEnum.INACTIVE,
        deliveryStatus: DeliveryStatusEnum.DELIVERED,
      },
    });
    return order ? order : false;
  }

  static async viewHistoryForShop(shop: Shop) {
    const order = await orderReposity.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        customer: true,
      },
      where: {
        shop: { id: shop.id },
        status: StatusEnum.INACTIVE,
        deliveryStatus: DeliveryStatusEnum.DELIVERED,
      },
    });
    return order ? order : false;
  }

  static async viewCancelOrderForCus(customer: Customer) {
    const order = await orderReposity.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        shop: true,
      },

      where: {
        customer: { id: customer.id },
        status: StatusEnum.INACTIVE,
        deliveryStatus: DeliveryStatusEnum.CANCELLED,
      },
    });
    return order ? order : false;
  }

  static async postNew(
    address: string,
    paymentId: number,
    orders: OrderRequest[],
    customer: Customer
  ) {
    //check payment
    const payment = await paymentReposity.findOne({
      where: {
        id: paymentId,
      },
    });
    if (payment == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Payment not exist.');
    }

    //For loop ORDER
    const orderArr: Order[] = [];
    for (let i = 0; i < orders.length; i++) {
      let totalBill = orders[i].totalBill;
      //check shopping unit
      const shoppingUnit = await shoppingUnitReposity.findOne({
        where: {
          id: orders[i].shoppingUnitId,
        },
      });
      if (shoppingUnit == null) {
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'Shopping unit not exist.'
        );
      }
      //check valid shop
      const shop = await shopReposity.findOne({
        where: {
          id: orders[i].shopId,
        },
      });
      if (shop == null) {
        return new Response(HttpStatusCode.BAD_REQUEST, 'Shop not exist.');
      }
      let findOrder = new Order();

      //check voucher
      let voucher: Voucher[] = [];
      if (
        orders[i].voucherIds !== undefined &&
        orders[i].voucherIds.length !== 0
      ) {
        const now = new Date();
        voucher = await voucherReposity.find({
          where: {
            id: In(orders[i].voucherIds),
            //mfgDate: LessThan(now),
            //expDate: MoreThan(now),
          },
        });
        console.log(voucher.length);
        console.log(orders[i].voucherIds.length);
        if (voucher.length !== orders[i].voucherIds.length) {
          return new Response(HttpStatusCode.BAD_REQUEST, 'Invalid voucher.');
        }
      }
      (findOrder.deliveryStatus = DeliveryStatusEnum.CHECKING),
        (findOrder.address = address),
        (findOrder.estimateDeliveryTime = orders[i].estimateDeliveryTime),
        (findOrder.status = StatusEnum.ACTIVE),
        (findOrder.totalBill = orders[i].totalBill),
        (findOrder.transportFee = orders[i].transportFee),
        (findOrder.totalPayment =
          +orders[i].totalBill + +orders[i].transportFee),
        (findOrder.payment = payment),
        (findOrder.shoppingUnit = shoppingUnit),
        (findOrder.shop = shop),
        (findOrder.customer = customer);
      findOrder.voucher = voucher;

      let orderProductArr: OrderProduct[] = [];
      const orderProduct = orders[i].orderProducts;
      //For loop ORDER PRODUCT
      for (let j = 0; j < orderProduct.length; j++) {
        let orderProductEntity = new OrderProduct();
        const product = await productRepository.findOne({
          select: [
            'id',
            'name',
            'detail',
            'amount',
            'quantity',
            'sold',
            'star',
            'status',
          ],
          where: {
            id: orderProduct[j].productId,
          },
        });
        if (product == null) {
          return new Response(HttpStatusCode.BAD_REQUEST, 'Product not exist.');
        } else {
          (orderProductEntity.additionalInfo = orderProduct[j].additionalInfo),
            (orderProductEntity.price = orderProduct[j].price),
            (orderProductEntity.quantity = orderProduct[j].quantity),
            (orderProductEntity.product = product),
            (totalBill -= orderProduct[j].price * orderProduct[j].quantity);
          orderProductArr.push(orderProductEntity);
        }
      }
      if (totalBill != 0) {
        return new Response(HttpStatusCode.BAD_REQUEST, 'Invalid invoice.');
      }
      findOrder.orderProducts = orderProductArr;
      orderArr.push(findOrder);
    }

    //save order
    const order: Order[] = await orderReposity.save(orderArr);

    return new Response(
      HttpStatusCode.OK,
      'Create new order successfully!',
      order
    );
  }

  static async editDeliveryStatus(
    id: string,
    deliveryStatus: DeliveryStatusEnum,
  ) {
    const order = await orderReposity.findOne({
      where: {
        id: id,
      },
    });
    if (order != null && deliveryStatus <= order.deliveryStatus) {
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Cannot change status backward'
      );
    } else {
      if (deliveryStatus == DeliveryStatusEnum.DELIVERED) {
        const order = await orderReposity.update(
          { id: id },
          { deliveryStatus: deliveryStatus, status: StatusEnum.INACTIVE }
        );
        if (order.affected == 1) {
          return new Response(HttpStatusCode.OK, 'Done!');
        } else {
          return new Response(HttpStatusCode.BAD_REQUEST, 'Not Done!');
        }
      } else {
        const order = await orderReposity.update(
          { id: id },
          { deliveryStatus: deliveryStatus, status: StatusEnum.ACTIVE }
        );
        if (order.affected == 1) {
          return new Response(HttpStatusCode.OK, 'Done!');
        } else {
          return new Response(HttpStatusCode.BAD_REQUEST, 'Not Done!');
        }
      }
    }
  }

  static async cancelOrder(id: string) {
    const order = await orderReposity.findOne({
      where: {
        id: id,
      },
    });
    if (order == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Order not exist.');
    }
    if (
      order.deliveryStatus == DeliveryStatusEnum.PACKAGING ||
      order.deliveryStatus == DeliveryStatusEnum.DELIVERING
    ) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Order can not cancel');
    }

    const result = await orderReposity.update(
      {
        id: id,
      },

      {
        deliveryStatus: DeliveryStatusEnum.CANCELLED,
        status: StatusEnum.INACTIVE,
      }
    );
    if (result.affected == 1) {
      return new Response(HttpStatusCode.OK, 'Cancel order successfully!');
    } else {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Cancel order failed!');
    }
  }

  // static async returnOrder(id: string){
  //     const now = new Date();

  // }
}

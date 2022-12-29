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
  TitleStatusEnum,
} from '../utils/shopp.enum';
import { OrderRequest } from '../interfaces/order';
import { In, Like } from 'typeorm';
import { TrackingOrder } from '../entities/trackingOrder';

const orderRepository = ShopPDataSource.getRepository(Order);
const shopRepository = ShopPDataSource.getRepository(Shop);
const paymentRepository = ShopPDataSource.getRepository(Payment);
const shoppingUnitRepository = ShopPDataSource.getRepository(ShoppingUnit);
const voucherRepository = ShopPDataSource.getRepository(Voucher);
const productRepository = ShopPDataSource.getRepository(Product);
const trackingRepository = ShopPDataSource.getRepository(TrackingOrder);

export default class orderModel {
  static async getOne(id: string) {
    const order = await orderRepository.findOne({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        customer: true,
        shop: true,
      },
      where: {
        id: id,
        status: StatusEnum.ACTIVE,
      },
    });
    return order ? order : false;
  }

  static async viewOrderForCustomer(customer: Customer) {
    const order = await orderRepository.find({
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
          deliveryStatus: Like(DeliveryStatusEnum.CHECKING),
        },
        {
          customer: { id: customer.id },
          status: StatusEnum.ACTIVE,
          deliveryStatus: Like(DeliveryStatusEnum.CONFIRMED),
        },
        {
          customer: { id: customer.id },
          status: StatusEnum.ACTIVE,
          deliveryStatus: Like(DeliveryStatusEnum.PACKAGING),
        },
      ],
    });
    return order ? order : false;
  }

  static async viewOrderForShop(shop: Shop) {
    const order = await orderRepository.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        customer: true,
      },
      where: {
        shop: { id: shop.id },
        status: StatusEnum.ACTIVE,
        deliveryStatus: Like(DeliveryStatusEnum.CHECKING),
      },
    });
    return order ? order : false;
  }

  static async viewConfirmOrderForShop(shop: Shop) {
    const order = await orderRepository.find({
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
          deliveryStatus: Like(DeliveryStatusEnum.CONFIRMED),
        },
        {
          shop: { id: shop.id },
          status: StatusEnum.ACTIVE,
          deliveryStatus: Like(DeliveryStatusEnum.PACKAGING),
        },
      ],
    });
    return order ? order : false;
  }

  static async viewOrderDeliverForCus(customer: Customer) {
    const order = await orderRepository.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        shop: true,
      },

      where: {
        customer: { id: customer.id },
        status: StatusEnum.ACTIVE,
        deliveryStatus: Like(DeliveryStatusEnum.DELIVERING),
      },
    });
    return order ? order : false;
  }

  static async viewOrderDeliverForShop(shop: Shop) {
    const order = await orderRepository.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        customer: true,
      },
      where: {
        shop: { id: shop.id },
        status: StatusEnum.ACTIVE,
        deliveryStatus: Like(DeliveryStatusEnum.DELIVERING),
      },
    });
    return order ? order : false;
  }

  static async viewHistoryForCus(customer: Customer) {
    const order = await orderRepository.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        shop: true,
      },
      where: {
        customer: { id: customer.id },
        status: StatusEnum.INACTIVE,
        deliveryStatus: Like(DeliveryStatusEnum.DELIVERED),
      },
    });
    return order ? order : false;
  }

  static async viewHistoryForShop(shop: Shop) {
    const order = await orderRepository.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        customer: true,
      },
      where: {
        shop: { id: shop.id },
        status: StatusEnum.INACTIVE,
        deliveryStatus: Like(DeliveryStatusEnum.DELIVERED),
      },
    });
    return order ? order : false;
  }

  static async viewCancelOrderForCus(customer: Customer) {
    const order = await orderRepository.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        shop: true,
      },

      where: {
        customer: { id: customer.id },
        status: StatusEnum.INACTIVE,
        deliveryStatus: Like(DeliveryStatusEnum.CANCELLED),
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
    const payment = await paymentRepository.findOne({
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
      let totalBill = 0;
      //check shopping unit
      const shoppingUnit = await shoppingUnitRepository.findOne({
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
      const shop = await shopRepository.findOne({
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
        voucher = await voucherRepository.find({
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
        (findOrder.transportFee = orders[i].transportFee),
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
          //Calculate total bill
          totalBill += orderProduct[j].price * orderProduct[j].quantity;
        }
      }

      (findOrder.totalBill = totalBill),
        (findOrder.totalPayment = totalBill + +orders[i].transportFee),
        (findOrder.orderProducts = orderProductArr);
      orderArr.push(findOrder);
    }

    //save order
    const order: Order[] = await orderRepository.save(orderArr);

    return new Response(
      HttpStatusCode.OK,
      'Create new order successfully!',
      order
    );
  }

  static async editDeliveryStatus(
    id: string,
    deliveryStatus: number,
    title: number
  ) {
    if (deliveryStatus == 3) {
      if (title < 3.1 || title > 3.4) {
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'Title is not match delivery status 3'
        );
      }
    } else {
      if (deliveryStatus != title) {
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'Title is not match delivery status '
        );
      }
    }
    const order = await orderRepository.findOne({
      where: {
        id: id,
      },
    });
    if (order != null && deliveryStatus < order.deliveryStatus) {
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Cannot change status backward'
      );
    }
    if (deliveryStatus == 4) {
      const order = await orderRepository.update(
        { id: id },
        { deliveryStatus: deliveryStatus, status: StatusEnum.INACTIVE }
      );
      if (order.affected == 1) {
        return new Response(HttpStatusCode.OK, 'Done!');
      } else {
        return new Response(HttpStatusCode.BAD_REQUEST, 'Not Done!');
      }
    } else {
      const order = await orderRepository.update(
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

  static async cancelOrder(id: string, title: number) {
    const order = await orderRepository.findOne({
      where: {
        id: id,
      },
    });
    if (order == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Order not exist.');
    }

    if (title < 5.1 || title > 5.2) {
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Title is not match delivery status 5'
      );
    }
    if (order.deliveryStatus < 0 || order.deliveryStatus > 1) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Order can not cancel');
    }

    const result = await orderRepository.update(
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

  static async returnOrder(id: string, title: number) {
    const order = await orderRepository.findOne({
      where: {
        id: id,
      },
    });
    if (order == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Order not exist.');
    }
    if (title < 6.1 || title > 6.2) {
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Title is not match delivery status 6'
      );
    }
    if (
      order.deliveryStatus !== DeliveryStatusEnum.DELIVERED &&
      order.deliveryStatus !== DeliveryStatusEnum.DELIVERING
    ) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Order can not return');
    }

    if (order.deliveryStatus == 3) {
      const trackingOrder = await trackingRepository.findOne({
        where: {
          orderNumber: { id: id },
          title: Like(TitleStatusEnum.ORDER_IS_BEING_DELIVERY_TO_YOU),
        },
      });
      if (trackingOrder == null) {
        return new Response(HttpStatusCode.BAD_REQUEST, 'Order can not return');
      }
    } else if (order.deliveryStatus == 4) {
      const trackingOrder = await trackingRepository.findOne({
        where: {
          orderNumber: { id: id },
          deliveryStatus: Like(DeliveryStatusEnum.DELIVERED),
        },
      });
      if (trackingOrder == null) {
        return new Response(HttpStatusCode.BAD_REQUEST, 'Order can not return');
      } else {
        var date = new Date();
        var deliverDate = trackingOrder.time;
        var difference = date.getTime() - deliverDate.getTime();
        var TotalDays = Math.round(difference / (1000 * 3600 * 24));

        if (TotalDays < 0 || TotalDays > 4) {
          return new Response(
            HttpStatusCode.BAD_REQUEST,
            'Only returned order in three days after received order '
          );
        }
      }
    }

    const result = await orderRepository.update(
      {
        id: id,
      },

      {
        deliveryStatus: DeliveryStatusEnum.RETURNED,
        status: StatusEnum.INACTIVE,
      }
    );
    if (result.affected == 1) {
      return new Response(HttpStatusCode.OK, 'Return order successfully!');
    } else {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Return order failed!');
    }
  }
}

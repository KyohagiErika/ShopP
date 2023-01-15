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
  ProductEnum,
  RoleEnum,
  StatusEnum,
  TitleStatusEnum,
  VoucherTypeEnum,
} from '../utils/shopp.enum';
import { OrderRequest } from '../interfaces/order';
import { In, LessThan, Like, MoreThan } from 'typeorm';
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
        customer: true,
        shop: true,
      },
      where: {
        id: id,
      },
    });
    return order ? order : false;
  }

  static async viewOrderForCustomer(customer: Customer) {
    return await orderRepository.find({
      relations: {
        payment: true,
        shoppingUnit: true,
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
  }

  static async viewOrderForShop(shop: Shop) {
    return await orderRepository.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        customer: true,
      },
      where: {
        shop: { id: shop.id },
        status: StatusEnum.ACTIVE,
        deliveryStatus: Like(DeliveryStatusEnum.CHECKING),
      },
    });
  }

  static async viewConfirmOrderForShop(shop: Shop) {
    return await orderRepository.find({
      relations: {
        payment: true,
        shoppingUnit: true,
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
  }

  static async viewOrderDeliverForCus(customer: Customer) {
    return await orderRepository.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        shop: true,
      },
      where: {
        customer: { id: customer.id },
        status: StatusEnum.ACTIVE,
        deliveryStatus: Like(DeliveryStatusEnum.DELIVERING),
      },
    });
  }

  static async viewOrderDeliverForShop(shop: Shop) {
    return await orderRepository.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        customer: true,
      },
      where: {
        shop: { id: shop.id },
        status: StatusEnum.ACTIVE,
        deliveryStatus: Like(DeliveryStatusEnum.DELIVERING),
      },
    });
  }

  static async viewHistoryForCus(customer: Customer) {
    return await orderRepository.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        shop: true,
      },
      where: {
        customer: { id: customer.id },
        status: StatusEnum.INACTIVE,
        deliveryStatus: Like(DeliveryStatusEnum.DELIVERED),
      },
    });
  }

  static async viewHistoryForShop(shop: Shop) {
    return await orderRepository.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        customer: true,
      },
      where: {
        shop: { id: shop.id },
        status: StatusEnum.INACTIVE,
        deliveryStatus: Like(DeliveryStatusEnum.DELIVERED),
      },
    });
  }

  static async viewCancelOrderForCus(customer: Customer) {
    return await orderRepository.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        shop: true,
      },
      where: {
        customer: { id: customer.id },
        status: StatusEnum.INACTIVE,
        deliveryStatus: Like(DeliveryStatusEnum.CANCELLED),
      },
    });
  }

  static async postNew(
    address: string,
    paymentId: number,
    orders: OrderRequest[],
    customer: Customer,
    appVoucherId: string | null,
    freeShipVoucherId: string | null
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

    //check app voucher
    let appVoucher: Voucher | null = null;
    if (appVoucherId != null) {
      appVoucher = await voucherRepository.findOne({
        where: {
          id: appVoucherId,
          roleCreator: Like(RoleEnum.ADMIN),
          mfgDate: LessThan(new Date()),
          expDate: MoreThan(new Date()),
        },
      });
      if (appVoucher == null)
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'App Voucher not exist.'
        );
    }

    let freeShipVoucher: Voucher | null = null;
    if (freeShipVoucherId != null) {
      freeShipVoucher = await voucherRepository.findOne({
        where: {
          id: freeShipVoucherId,
          roleCreator: Like(RoleEnum.ADMIN),
          mfgDate: LessThan(new Date()),
          expDate: MoreThan(new Date()),
        },
      });
      if (freeShipVoucher == null)
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'FreeShip Voucher not exist.'
        );
    }

    //For loop ORDER
    let allTotalBill = 0;
    let allTotalTransportFee = 0;
    const orderArr: Order[] = [];
    for (let i = 0; i < orders.length; i++) {
      console.log('allTotalBill: ' + allTotalBill);
      console.log('allTotalTransportFee: ' + allTotalTransportFee);
      console.log('-------');
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

      //check shop voucher
      let shopVoucher: Voucher | null = null;
      if (
        orders[i].shopVoucherId !== undefined &&
        orders[i].shopVoucherId !== ''
      ) {
        shopVoucher = await voucherRepository.findOne({
          where: {
            id: orders[i].shopVoucherId,
            roleCreator: Like(RoleEnum.SHOP),
            mfgDate: LessThan(new Date()),
            expDate: MoreThan(new Date()),
          },
        });
        if (shopVoucher == null) {
          return new Response(
            HttpStatusCode.BAD_REQUEST,
            'Invalid shop voucher.'
          );
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

      let orderProductArr: OrderProduct[] = [];
      const orderProduct = orders[i].orderProducts;
      //For loop ORDER PRODUCT
      for (let j = 0; j < orderProduct.length; j++) {
        let orderProductEntity = new OrderProduct();
        const product = await productRepository.findOne({
          where: {
            id: orderProduct[j].productId,
            shop: { id: shop.id },
            status: In([ProductEnum.AVAILABLE, ProductEnum.OUT_OF_ORDER]),
          },
        });
        if (product == null) {
          return new Response(HttpStatusCode.BAD_REQUEST, 'Product not exist.');
        } else {
          (orderProductEntity.additionalInfo = orderProduct[j].additionalInfo),
            (orderProductEntity.price = product.amount),
            (orderProductEntity.quantity = orderProduct[j].quantity),
            (orderProductEntity.product = product),
            orderProductArr.push(orderProductEntity);
          //Calculate total bill
          totalBill += +product.amount * +orderProduct[j].quantity;
          console.log('totalBill: ' + totalBill);
          console.log('-------');
        }
      }

      (findOrder.orderProducts = orderProductArr),
        (findOrder.totalBill = totalBill);

      //minus discount from shop voucher
      if (shopVoucher != null) {
        //calculate shop voucher discount
        if (totalBill < shopVoucher.minBillPrice)
          return new Response(
            HttpStatusCode.BAD_REQUEST,
            'Can not use this shop voucher!'
          );
        if (shopVoucher.type == VoucherTypeEnum.MONEY) {
          if (shopVoucher.priceDiscount >= totalBill) {
            findOrder.shopVoucher = totalBill;
          } else {
            findOrder.shopVoucher = shopVoucher.priceDiscount;
          }
        } else {
          //VoucherTypeEnum.PERCENT
          let percentDiscount = Math.round(
            shopVoucher.priceDiscount * 0.01 * totalBill
          );
          if (percentDiscount >= shopVoucher.maxPriceDiscount)
            percentDiscount = shopVoucher.maxPriceDiscount;
          if (percentDiscount >= totalBill) {
            findOrder.shopVoucher = totalBill;
          } else {
            findOrder.shopVoucher = percentDiscount;
          }
        }
        totalBill -= +findOrder.shopVoucher;
      }

      allTotalBill += totalBill;
      allTotalTransportFee += findOrder.transportFee;
      console.log('allTotalBill: ' + allTotalBill);
      console.log('allTotalTransportFee: ' + allTotalTransportFee);
      console.log('totalBill: ' + totalBill);
      console.log('-------');
      orderArr.push(findOrder);
    }

    if (appVoucher != null) {
      //calculate app voucher discount
      if (allTotalBill > 0) {
        if (allTotalBill < appVoucher.minBillPrice)
          return new Response(
            HttpStatusCode.BAD_REQUEST,
            'Can not use this app voucher!'
          );
        if (appVoucher.type == VoucherTypeEnum.MONEY) {
          if (appVoucher.priceDiscount >= allTotalBill) {
            for (let i = 0; i < orderArr.length; i++) {
              orderArr[i].appVoucher = Math.round(
                (allTotalBill * orderArr[i].totalBill) / allTotalBill
              );
              console.log('appVoucher(order): ' + orderArr[i].appVoucher);
              console.log('-------');
            }
          } else {
            for (let i = 0; i < orderArr.length; i++) {
              orderArr[i].appVoucher = Math.round(
                (appVoucher.priceDiscount * orderArr[i].totalBill) /
                  allTotalBill
              );
              console.log('appVoucher(order): ' + orderArr[i].appVoucher);
              console.log('-------');
            }
          }
        } else {
          //VoucherTypeEnum.PERCENT
          let percentDiscount = Math.round(
            appVoucher.priceDiscount * 0.01 * allTotalBill
          );
          if (percentDiscount >= appVoucher.maxPriceDiscount)
            percentDiscount = appVoucher.maxPriceDiscount;
          if (percentDiscount >= allTotalBill) {
            for (let i = 0; i < orderArr.length; i++) {
              orderArr[i].appVoucher = Math.round(
                (allTotalBill * orderArr[i].totalBill) / allTotalBill
              );
              console.log('appVoucher(order): ' + orderArr[i].appVoucher);
              console.log('-------');
            }
          } else {
            for (let i = 0; i < orderArr.length; i++) {
              orderArr[i].appVoucher = Math.round(
                (percentDiscount * orderArr[i].totalBill) / allTotalBill
              );
              console.log('appVoucher(order): ' + orderArr[i].appVoucher);
              console.log('-------');
            }
          }
        }
      }
    }

    if (freeShipVoucher != null) {
      //calculate free-ship voucher discount
      if (allTotalTransportFee < freeShipVoucher.minBillPrice)
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'Can not use this free-ship voucher!'
        );
      if (freeShipVoucher.priceDiscount >= allTotalTransportFee) {
        for (let i = 0; i < orderArr.length; i++) {
          orderArr[i].freeShipVoucher = Math.round(
            (allTotalTransportFee * orderArr[i].transportFee) /
              allTotalTransportFee
          );
          console.log('freeShipVoucher(order): ' + orderArr[i].freeShipVoucher);
          console.log('-------');
        }
      } else {
        for (let i = 0; i < orderArr.length; i++) {
          orderArr[i].freeShipVoucher = Math.round(
            (freeShipVoucher.priceDiscount * orderArr[i].transportFee) /
              allTotalTransportFee
          );
          console.log('freeShipVoucher(order): ' + orderArr[i].freeShipVoucher);
          console.log('-------');
        }
      }
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
      const check = await trackingRepository.find({
        where: {
          orderNumber: { id: id },
          deliveryStatus: Like(DeliveryStatusEnum.DELIVERING),
        },
      });
      for (let i = 0; i < check.length; i++) {
        if (check[i].title > title) {
          return new Response(
            HttpStatusCode.BAD_REQUEST,
            'Cannot change title backward'
          );
        }
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

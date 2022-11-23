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
import { In } from 'typeorm';
import { OrderRequest } from '../interfaces/orderRequest';

const orderReposity = ShopPDataSource.getRepository(Order);
const shopReposity = ShopPDataSource.getRepository(Shop);
const paymentReposity = ShopPDataSource.getRepository(Payment);
const shoppingUnitReposity = ShopPDataSource.getRepository(ShoppingUnit);
const voucherReposity = ShopPDataSource.getRepository(Voucher);
const productRepository = ShopPDataSource.getRepository(Product);
const orderProductRepository = ShopPDataSource.getRepository(OrderProduct);

export default class orderModel {
  static async viewOrderForCustomer(customer: Customer) {
    const order = await orderReposity.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        customer: true,
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
    const findOrderProduct = await orderProductRepository.find({
      relations: {
        product: { shop: true },
        orderNumber: true,
      },
      select: {
        id: true,
      },
      where: {
        product: { shop: { id: shop.id } },

      }
    })
    //return findOrderProduct ? findOrderProduct : false;
    const length = findOrderProduct.length;
    let order: Order[] = [];
    for (let i = 0; i < length; i++) {
      let findOrder = await orderReposity.findOne({
        relations: {
          payment: true,
          shoppingUnit: true,
          voucher: true,
          customer: true,
          orderProducts: true,
        },
        where:
        {
          // id: In([...findOrderProduct]),
          orderProducts: { id: findOrderProduct[i].id },
          status: StatusEnum.ACTIVE,
          deliveryStatus: DeliveryStatusEnum.CHECKING,
        },
      });
      if (findOrder != null) {
        order.push(findOrder);
      }

    }
    return order ? order : false;

  }

  static async viewOrderDeliver() {
    const order = await orderReposity.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        customer: true,
      },
      select: {
        id: true,
        createdAt: true,
        deliveryStatus: true,
        address: true,
        customer: {
          name: true,
        },
        payment: {
          name: true,
        },
        estimateDeliveryTime: true,
        shoppingUnit: {
          name: true,
        },
        totalBill: true,
        transportFee: true,
        voucher: {
          title: true,
        },
        totalPayment: true,
        status: true,
      },
      where: {
        status: StatusEnum.ACTIVE,
        deliveryStatus: DeliveryStatusEnum.DELIVERING,
      },
    });
    return order ? order : false;
  }

  static async viewHistory() {
    const order = await orderReposity.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        customer: true,
      },
      select: {
        id: true,
        createdAt: true,
        deliveryStatus: true,
        address: true,
        customer: {
          name: true,
        },
        payment: {
          name: true,
        },
        estimateDeliveryTime: true,
        shoppingUnit: {
          name: true,
        },
        totalBill: true,
        transportFee: true,
        voucher: {
          title: true,
        },
        totalPayment: true,
        status: true,
      },
      where: {
        status: StatusEnum.INACTIVE,
        deliveryStatus: DeliveryStatusEnum.DELIVERED,
      },
    });
    return order ? order : false;
  }

  static async viewCancelOrder() {
    const order = await orderReposity.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        customer: true,
      },
      select: {
        id: true,
        createdAt: true,
        deliveryStatus: true,
        address: true,
        customer: {
          name: true,
        },
        payment: {
          name: true,
        },
        estimateDeliveryTime: true,
        shoppingUnit: {
          name: true,
        },
        totalBill: true,
        transportFee: true,
        voucher: {
          title: true,
        },
        totalPayment: true,
        status: true,
      },
      where: {
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
    customer: Customer,
  ) {

    const payment = await paymentReposity.findOne({
      where: {
        id: paymentId,
      },
    });
    if (payment == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'payment not exist.');
    }

    orders.forEach(async (order) => {


      const shoppingUnit = await shoppingUnitReposity.findOne({
        where: {
          id: order.shoppingUnitId,
        },
      });
      if (shoppingUnit == null) {
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'shopping unit not exist.'
        );
      }
      const shop = await shopReposity.findOne({
        where: {
          id: order.shopId,
        },
      });
      if (shop == null) {
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'shop not exist.'
        );
      }


      let voucher = null;
      let findOrder = new Order();
      if (order.voucherId == null) {
        voucher = null;
      } else {
        voucher = await voucherReposity.find({
          where: {
            id: order.voucherId,
          },
        });
        if (voucher == null) {
          return new Response(HttpStatusCode.BAD_REQUEST, 'voucher not exist.');
        } else {
          (findOrder.deliveryStatus = DeliveryStatusEnum.CHECKING),
            (findOrder.address = address),
            (findOrder.estimateDeliveryTime = order.estimateDeliveryTime),
            (findOrder.status = StatusEnum.ACTIVE),
            (findOrder.totalBill = order.totalBill),
            (findOrder.transportFee = order.transportFee),
            (findOrder.totalPayment = parseInt(order.totalBill.toString()) + parseInt(order.transportFee.toString())),
            (findOrder.payment = payment),
            (findOrder.shoppingUnit = shoppingUnit),
            (findOrder.voucher = voucher),
            (findOrder.shop = shop),
            (findOrder.customer = customer);
          const orderFinal = await orderReposity.save(findOrder);
          order.orderProducts.forEach(async (orderProduct) => {
            let orderProductEntity = new OrderProduct()
            const product = await productRepository.findOne({
              where: {
                id: orderProduct.productId,
              },
            });
            if (product == null) {
              return new Response(
                HttpStatusCode.BAD_REQUEST,
                'product not exist.'
              );
            }
            orderProductEntity.additionalInfo = orderProduct.additionalInfo,
              orderProductEntity.price = orderProduct.price,
              orderProductEntity.quantity = orderProduct.quantity,
              orderProductEntity.product = product,
              orderProductEntity.orderNumber = orderFinal

            return await orderProductRepository.save(orderProductEntity)

          })

        }
      }
      return;
    })

    return new Response(
      HttpStatusCode.CREATED,
      'Create new order successfully!',
    );
  }

  static async editDeliveryStatus(
    id: string,
    deliveryStatus: DeliveryStatusEnum
  ) {
    const order = await orderReposity.findOne({
      where: {
        id: id
      }
    })
    if (order != null && deliveryStatus <= order.deliveryStatus) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Cannot change status backward')

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

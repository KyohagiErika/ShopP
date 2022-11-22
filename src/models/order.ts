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
        shop: true,
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
    const order = await orderReposity.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        shop: true,
        customer: true,
      },
      where: [
        {
          shop: { id: shop.id },
          status: StatusEnum.ACTIVE,
          deliveryStatus: DeliveryStatusEnum.CHECKING,
        },
      ],
    });
    return order ? order : false;
  }

  static async viewOrderDeliver() {
    const order = await orderReposity.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        shop: true,
        customer: true,
      },
      select: {
        id: true,
        createdAt: true,
        deliveryStatus: true,
        address: true,
        shop: {
          name: true,
        },
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
        shop: true,
        customer: true,
      },
      select: {
        id: true,
        createdAt: true,
        deliveryStatus: true,
        address: true,
        shop: {
          name: true,
        },
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
        shop: true,
        customer: true,
      },
      select: {
        id: true,
        createdAt: true,
        deliveryStatus: true,
        address: true,
        shop: {
          name: true,
        },
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
    deliveryStatus: DeliveryStatusEnum,
    address: string,
    estimateDeliveryTime: string,
    totalBill: number,
    transportFee: number,
    totalPayment: number,
    status: StatusEnum,
    paymentId: number,
    shoppingUnitId: number,
    voucherId: string,
    shopId: string,
    customer: Customer,
    orderProducts: OrderProduct[]
  ) {
    const shop = await shopReposity.findOne({
      where: {
        id: shopId,
      },
    });
    if (shop == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'shop not exist.');
    }

    const payment = await paymentReposity.findOne({
      where: {
        id: paymentId,
      },
    });
    if (payment == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'payment not exist.');
    }

    const shoppingUnit = await shoppingUnitReposity.findOne({
      where: {
        id: shoppingUnitId,
      },
    });
    if (shoppingUnit == null) {
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'shopping unit not exist.'
      );
    }
    const voucher = await voucherReposity.find({
      where: {
        id: voucherId,
      },
    });
    if (voucher == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'voucher not exist.');
    } else {
      let order = new Order();
      (order.deliveryStatus = deliveryStatus),
        (order.address = address),
        (order.estimateDeliveryTime = estimateDeliveryTime),
        (order.status = status),
        (order.totalBill = totalBill),
        (order.transportFee = transportFee),
        (order.totalPayment = totalPayment),
        (order.payment = payment),
        (order.shoppingUnit = shoppingUnit),
        (order.voucher = voucher),
        (order.shop = shop),
        (order.customer = customer),
        (order.orderProducts = orderProducts);

      await orderReposity.save(order);

      const length = orderProducts.length;
      for (let i = 0; i < length; i++) {
        const findProduct = await productRepository.findOne({
          where: {
            id: orderProducts[i].product.id,
          },
        });
        if (findProduct == null) {
          return new Response(
            HttpStatusCode.BAD_REQUEST,
            'product is not exist !'
          );
        }
        if (
          orderProducts[i].quantity > findProduct.quantity ||
          orderProducts[i].quantity < 1
        )
          return new Response(
            HttpStatusCode.BAD_REQUEST,
            'quantity must be greater than 0 and less than product quantity'
          );

        let orderProduct = new OrderProduct();
        (orderProduct.price = orderProducts[i].price),
          (orderProduct.additionalInfo = orderProducts[i].additionalInfo),
          (orderProduct.quantity = orderProducts[i].quantity),
          (orderProduct.product = findProduct),
          (orderProduct.orderNumber = order);

        await orderProductRepository.save(orderProduct);
      }
      return new Response(
        HttpStatusCode.CREATED,
        'Create new order successfully!',
        order
      );
    }
  }

  static async editDeliveryStatus(
    id: string,
    deliveryStatus: DeliveryStatusEnum
  ) {
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

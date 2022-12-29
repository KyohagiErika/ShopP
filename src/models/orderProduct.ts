import { ShopPDataSource } from '../data';
import { Customer } from '../entities/customer';
import { OrderProduct } from '../entities/orderProduct';
import { Shop } from '../entities/shop';

const orderProductRepository = ShopPDataSource.getRepository(OrderProduct);
export default class orderProductModel {
  static async viewShopOrderProduct(orderNumber: string, shop: Shop) {
    const order = await orderProductRepository.findOne({
      relations: {
        product: true,
      },
      where: {
        orderNumber: {
          id: orderNumber,
          shop: { id: shop.id },
        },
      },
    });
    return order ? order : false;
  }

  static async viewCustomerOrderProduct(
    orderNumber: string,
    customer: Customer
  ) {
    const order = await orderProductRepository.findOne({
      relations: {
        product: true,
      },
      where: {
        orderNumber: {
          id: orderNumber,
          customer: { id: customer.id },
        },
      },
    });
    return order ? order : false;
  }
}

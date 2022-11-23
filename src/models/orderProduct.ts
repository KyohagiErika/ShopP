import { ShopPDataSource } from '../data';
import { OrderProduct } from '../entities/orderProduct';

const orderProductRepository = ShopPDataSource.getRepository(OrderProduct);
export default class orderProductModel {
  static async viewOrderProduct(orderNumber: string) {
    const order = await orderProductRepository.find({
      relations: {
        product: true,
        orderNumber: true,
      },
      where: {
        orderNumber: { id: orderNumber },
      },
    });
    return order ? order : false;
  }
}

import { Shop } from './../entities/shop';
import Response from '../utils/response';
import { StatusEnum, HttpStatusCode } from './../utils/shopp.enum';
import { Customer } from './../entities/customer';
import { ShopPDataSource } from './../data';
import { Cart } from '../entities/cart';

export default class CartModel {
  static async showCart(id: number) {
    const cartRepository = ShopPDataSource.getRepository(Cart);
    // const customerRepository = ShopPDataSource.getRepository(Customer)
    // const checkExistCartOfCustomer = customerRepository.findOne()

    const cart = await cartRepository.findOne({
      where: {
        id,
        customer: { user: { status: StatusEnum.ACTIVE } },
      },
    });

    if (cart == null) {
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        `This Cart doesn't exist`
      );
    }
    return new Response(HttpStatusCode.OK, 'Show Cart successfully', cart);
  }

  static async postNew(customerId: string, products: string) {
    const cartRepository = ShopPDataSource.getRepository(Cart);
    const customerRepository = ShopPDataSource.getRepository(Customer);

    const customer = await customerRepository.findOne({
      where: {
        id: customerId,
      },
    });

    if (customer?.cart !== null) {
      return new Response(HttpStatusCode.BAD_REQUEST, `Cart existed`);
    }

    const cart = await cartRepository.save({
      products,
      customer: customer,
    });

    return new Response(
      HttpStatusCode.CREATED,
      'Create Cart successfully',
      cart
    );
  }
}

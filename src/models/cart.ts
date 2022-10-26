import { productsInCart } from './../interfaces/cart';
import { Product } from './../entities/product';
import Response from '../utils/response';
import { StatusEnum, HttpStatusCode } from './../utils/shopp.enum';
import { Customer } from './../entities/customer';
import { ShopPDataSource } from './../data';
import { Cart } from '../entities/cart';
import { User } from '../entities/user';

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

  static async postNew(user: User ) {
    const cartRepository = ShopPDataSource.getRepository(Cart);
    const customerRepository = ShopPDataSource.getRepository(Customer);

    const customer = await customerRepository.findOne({
      relations: {
        cart: true,
      },
      where: {
        id: user.customer.id,
      },
    });

    if (customer == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, `Customer doesnt exist`);
    }
    if (customer.cart !== null) {
      return new Response(HttpStatusCode.BAD_REQUEST, `Cart existed`);
    }

    const cart = await cartRepository.save({
      product: '',
      customer: customer,
    });

    return new Response(
      HttpStatusCode.CREATED,
      'Create Cart successfully',
      cart
    );
  }

  static async update(cartId: number, products: string) {
    const cartRepository = ShopPDataSource.getRepository(Cart);
    const result = await cartRepository.update({
      id: cartId
    }, {
      products
    })
    if(result.affected == 0)
      return new Response(HttpStatusCode.BAD_REQUEST, `Update cart failed!!`);
    return new Response(HttpStatusCode.OK, `Update cart successfully!!`);
  }
}

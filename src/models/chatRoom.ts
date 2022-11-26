import Response from '../utils/response';
import { StatusEnum, HttpStatusCode } from './../utils/shopp.enum';
import { ShopPDataSource } from './../data';
import { Cart } from '../entities/cart';
import { User } from '../entities/user';

export default class ChatRoomModel {
  static async getUserChatRoom(user: User) {
    const cartRepository = ShopPDataSource.getRepository(Cart);
    const cart = await cartRepository.findOne({
      where: {
        customer: { 
          user: { status: StatusEnum.ACTIVE },
          id: user.customer.id
        },
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

  static async findChatRoom(user: User, products: string) {
    const cartRepository = ShopPDataSource.getRepository(Cart);
    const cart = await cartRepository.findOne({
      where: {
        customer: {
          user: { status: StatusEnum.ACTIVE },
          id: user.customer.id,
        },
      },
    });
    if (cart == null) {
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        `This Cart doesn't exist`
      );
    }
    const result = await cartRepository.update(
      {
        id: cart.id,
      },
      {
        products,
      }
    );
    if (result.affected == 0)
      return new Response(HttpStatusCode.BAD_REQUEST, `Update cart failed!!`);
    return new Response(HttpStatusCode.OK, `Update cart successfully!!`);
  }

  static async createChat(user: User, products: string) {
    const cartRepository = ShopPDataSource.getRepository(Cart);
    const cart = await cartRepository.findOne({
      where: {
        customer: {
          user: { status: StatusEnum.ACTIVE },
          id: user.customer.id,
        },
      },
    });
    if (cart == null) {
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        `This Cart doesn't exist`
      );
    }
    const result = await cartRepository.update(
      {
        id: cart.id,
      },
      {
        products,
      }
    );
    if (result.affected == 0)
      return new Response(HttpStatusCode.BAD_REQUEST, `Update cart failed!!`);
    return new Response(HttpStatusCode.OK, `Update cart successfully!!`);
  }
}

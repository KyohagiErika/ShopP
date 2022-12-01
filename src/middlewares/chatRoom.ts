import { Request, Response } from 'express';
import { User } from '../entities/user';
import ChatRoomModel from '../models/chatRoom';
import CustomerModel from '../models/customer';
import ShopModel from '../models/shop';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode } from '../utils/shopp.enum';

export default class ChatRoomMiddleware {
  @ControllerService()
  static async getShopChatRoom(req: Request, res: Response) {
    const result = await ChatRoomModel.getShopChatRoom(res.locals.user);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'No Chat Available!' });
    }
  }

  @ControllerService()
  static async getCustomerChatRoom(req: Request, res: Response) {
    const result = await ChatRoomModel.getCustomerChatRoom(res.locals.user);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'No Chat Available!' });
    }
  }

  @ControllerService()
  static async findShopChatRoom(req: Request, res: Response) {
    const user: User = res.locals.user;
    //check valid customer
    const customer = await CustomerModel.getById(req.params.customerId);
    if (customer === null) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Invalid Customer!' });
    } else {
      const result = await ChatRoomModel.findChatRoom(user.shop, customer);
      if (result) {
        res.status(HttpStatusCode.OK).send({ data: result });
      } else {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .send({ message: 'No Chat Room available!' });
      }
    }
  }

  @ControllerService()
  static async findCustomerChatRoom(req: Request, res: Response) {
    const user: User = res.locals.user;
    //check valid shop
    const shop = await ShopModel.getOneById(req.params.shopId);
    if (!shop) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Invalid Shop!' });
    } else {
      const result = await ChatRoomModel.findChatRoom(shop, user.customer);
      if (result) {
        res.status(HttpStatusCode.OK).send({ data: result });
      } else {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .send({ message: 'No Chat Room available!' });
      }
    }
  }

  @ControllerService()
  static async createShopChat(req: Request, res: Response) {
    const user: User = res.locals.user;
    if (user.shop.id === req.params.customerId)
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Cannot create chat with yourself!' });

    //check valid customer
    const customer = await CustomerModel.getById(req.params.customerId);
    if (customer === null) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Invalid Customer!' });
    }
    const existedChatRoom = await ChatRoomModel.findChatRoom(
      user.shop,
      customer
    );
    if (existedChatRoom)
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Chat Room already existed!' });
    const result = await ChatRoomModel.createChat(user.shop, customer);
    return res
      .status(result.getCode())
      .send({ message: result.getMessage(), data: result.getData() });
  }

  @ControllerService()
  static async createCustomerChat(req: Request, res: Response) {
    const user: User = res.locals.user;
    if (user.customer.id === req.params.shopId)
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Cannot create chat with yourself!' });

    //check valid shop
    const shop = await ShopModel.getOneById(req.params.shopId);
    if (!shop) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Invalid Shop!' });
    }
    const existedChatRoom = await ChatRoomModel.findChatRoom(
      shop,
      user.customer
    );
    if (existedChatRoom)
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'Chat Room already existed!' });
    const result = await ChatRoomModel.createChat(shop, user.customer);
    return res
      .status(result.getCode())
      .send({ message: result.getMessage(), data: result.getData() });
  }
}

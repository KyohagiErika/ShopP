import { Request, Response } from 'express';
import ChatRoomModel from '../models/chatRoom';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode } from '../utils/shopp.enum';

export default class ChatRoomMiddleware {
  @ControllerService()
  static async getUserChatRoom(req: Request, res: Response) {
    const result = await ChatRoomModel.getUserChatRoom(res.locals.user);
    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(HttpStatusCode.OK)
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async findChatRoom(req: Request, res: Response) {
    const result = await ChatRoomModel.findChatRoom(
      res.locals.user,
      req.body.products
    );
    res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async createChat(req: Request, res: Response) {
    const result = await ChatRoomModel.createChat(
      res.locals.user,
      req.body.products
    );
    res.status(result.getCode()).send({ message: result.getMessage() });
  }
}

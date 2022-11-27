import { Request, Response } from 'express';
import ChatRoomModel from '../models/chatRoom';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode } from '../utils/shopp.enum';

export default class ChatRoomMiddleware {
  @ControllerService()
  static async getUserChatRoom(req: Request, res: Response) {
    const result = await ChatRoomModel.getUserChatRoom(res.locals.user);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'No Chat Available!' });
    }
  }

  @ControllerService({
    params: [
      {
        name: 'receiverId',
        type: Number,
      },
    ],
  })
  static async findChatRoom(req: Request, res: Response) {
    const result = await ChatRoomModel.findChatRoomOfUser(
      res.locals.user,
      +req.params.receiverId
    );
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'No Chat Room available!' });
    }
  }

  @ControllerService({
    params: [
      {
        name: 'receiverId',
        type: Number,
      },
    ],
  })
  static async createChat(req: Request, res: Response) {
    const result = await ChatRoomModel.createChat(
      res.locals.user,
      +req.body.receiverId
    );
    return res.status(result.getCode()).send({ message: result.getMessage() });
  }
}

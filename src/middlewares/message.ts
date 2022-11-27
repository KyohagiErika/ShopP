import { Request, Response } from 'express';
import MessageModel from '../models/message';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode } from '../utils/shopp.enum';

export default class MessageMiddleware {
  @ControllerService()
  static async getMessages(req: Request, res: Response) {
    const result = await MessageModel.getMessages(res.locals.user);
    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(HttpStatusCode.OK)
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService({
    body: [
      {
        name: 'chatRoomId',
        type: Number,
      },
      {
        name: 'text',
        type: String,
      }
    ],
})
  static async addMessage(req: Request, res: Response) {
    const result = await MessageModel.addMessage(
      res.locals.user,
      req.body.chatRoomId,
      req.body.text
    );
    res.status(result.getCode()).send({ message: result.getMessage() });
  }
}

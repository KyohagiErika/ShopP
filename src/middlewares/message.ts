import { Request, Response } from 'express';
import MessageModel from '../models/message';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode, TypeTransferEnum } from '../utils/shopp.enum';

export default class MessageMiddleware {
  @ControllerService()
  static async getShopMessages(req: Request, res: Response) {
    //check valid chatRoom of shop

    const result = await MessageModel.getMessages(+req.params.chatRoomId);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'No Message Available!' });
    }
  }

  @ControllerService()
  static async getCustomerMessages(req: Request, res: Response) {
    //check valid chatRoom of customer

    const result = await MessageModel.getMessages(+req.params.chatRoomId);
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'No Message Available!' });
    }
  }
}

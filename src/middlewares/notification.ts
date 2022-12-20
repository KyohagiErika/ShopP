import { Request, Response } from 'express';
import MessageModel from '../models/message';
import NotificationModel from '../models/notification';
import { ControllerService } from '../utils/decorators';
import { HttpStatusCode, RoleEnum } from '../utils/shopp.enum';

export default class NotificationMiddleware {
  @ControllerService()
  static async getShopNotifications(req: Request, res: Response) {
    const result = await NotificationModel.getNotifications(
      res.locals.user,
      RoleEnum.SHOP
    );
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'No Notifications Available!' });
    }
  }

  @ControllerService()
  static async getCustomerNotifications(req: Request, res: Response) {
    const result = await NotificationModel.getNotifications(
      res.locals.user,
      RoleEnum.CUSTOMER
    );
    if (result) {
      res.status(HttpStatusCode.OK).send({ data: result });
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'No Notifications Available!' });
    }
  }
}

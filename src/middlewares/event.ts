import { EventAdditionalInfo } from './../entities/eventAdditionalInfo';
import { HttpStatusCode } from './../utils/shopp.enum';
import { Request, Response } from 'express';
import EventModel from '../models/event';
import { ControllerService } from '../utils/decorators';
import { use } from 'chai';

export default class EventMiddleware {
  @ControllerService()
  static async listAdminEvents(req: Request, res: Response) {
    const result = await EventModel.listAdminEvents();

    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    else
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
  }

  @ControllerService()
  static async listShopEvents(req: Request, res: Response) {
    const userId = +req.params.userId;
    const result = await EventModel.listShopEvents(userId);

    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService({
    body: [
      {
        name: 'startingDate',
        type: String,
      },
    ],
  })
  static async newEvent(req: Request, res: Response) {
    const userId = +req.params.userId;
    const data = req.body;
    const additionalInfo = data.additionalInfo;
    const result = await EventModel.newEvent(
      userId,
      data.name,
      data.content,
      data.bannerId,
      data.startingDate,
      data.endingDate,
      additionalInfo
    );
    if (result.getCode() == HttpStatusCode.CREATED)
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async deleteEvent(req: Request, res: Response) {
    const id = +req.params.id;
    const result = await EventModel.deleteEvent(id);
    if (result.getCode() == HttpStatusCode.OK)
      res.status(result.getCode()).send({ message: result.getMessage() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }
}

import { EventAdditionalInfo } from './../entities/eventAdditionalInfo';
import { HttpStatusCode } from './../utils/shopp.enum';
import { Request, Response } from 'express';
import EventModel from '../models/event';
import { ControllerService } from '../utils/decorators';
import { use } from 'chai';
import ConvertDate from '../utils/convertDate';

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
        name: 'name',
        type: String,
        validator: (propName: string, value: string) => {
          return null;
        },
      },
      {
        name: 'startingDate',
        type: String,
        validator: (propName: string, value: string) => {
          if (!Date.parse(ConvertDate(value))) return `${propName} is invalid`;
          return null;
        },
      },
      {
        name: 'endingDate',
        type: String,
        validator: (propName: string, value: string) => {
          if (!Date.parse(ConvertDate(value))) return `${propName} is invalid`;
          return null;
        },
      },
      {
        name: 'additionalInfo',
        validator: (propName: string, value: object) => {
          if (typeof value != 'object' && value != null)
            return `${propName} must be an Object`;
          return null;
        },
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

  @ControllerService({
    body: [
      {
        name: 'name',
        type: String,
        validator: (propName: string, value: string) => {
          return null;
        },
      },
      {
        name: 'startingDate',
        type: String,
        validator: (propName: string, value: string) => {
          if (!Date.parse(ConvertDate(value))) return `${propName} is invalid`;
          return null;
        },
      },
      {
        name: 'endingDate',
        type: String,
        validator: (propName: string, value: string) => {
          if (!Date.parse(ConvertDate(value))) return `${propName} is invalid`;
          return null;
        },
      },
      {
        name: 'additionalInfo',
        validator: (propName: string, value: object) => {
          if (value != Object && value != null)
            return `${propName} must be an Object`;
          return null;
        },
      },
    ],
  })
  static async editEvent(req: Request, res: Response) {
    const id = +req.params.id;
    const data = req.body;
    const additionalInfo = data.additionalInfo;
    const result = await EventModel.editEvent(
      id,
      data.name,
      data.content,
      data.bannerId,
      new Date(ConvertDate(data.startingDate)),
      new Date(ConvertDate(data.endingDate)),
      additionalInfo
    );

    if (result.getCode() == HttpStatusCode.OK)
      res.status(result.getCode()).send({ message: result.getMessage() });
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

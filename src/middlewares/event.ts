import { HttpStatusCode } from './../utils/shopp.enum';
import { Request, Response } from 'express';
import EventModel from '../models/event';
import { ControllerService } from '../utils/decorators';
import ConvertDate from '../utils/convertDate';
import { LocalFile } from '../entities/localFile';
import UploadModel from '../models/upload';

export default class EventMiddleware {
  @ControllerService()
  static async listAll(req: Request, res: Response) {
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
    const result = await EventModel.listShopEvents(res.locals.user);
    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService({
    params: [
      {
        name: 'id',
        type: String,
      },
    ],
  })
  static async findEventById(req: Request, res: Response) {
    const id = +req.params.id;
    const result = await EventModel.findEventById(id, res.locals.user);
    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  /**
   * @swagger
   * components:
   *  schemas:
   *   EventRequest:
   *    type: object
   *    properties:
   *     name:
   *      type: string
   *      description: name of event
   *      example: flashSales
   *     content:
   *      type: string
   *      description: content of event
   *      example: discount everything
   *     banner:
   *      type: string
   *      format: binary
   *      description: banner of evaluation
   *     startingDate:
   *      type: string
   *      description: starting day of event
   *      example: 29-10-2023
   *     endingDate:
   *      type: string
   *      description: ending day of event
   *      example: 29-11-2023
   *     additionalInfo:
   *      type: array
   *      items:
   *       type: object
   *       properties:
   *        key:
   *         type: string
   *         description: key of event additional info
   *         example: describe
   *        value:
   *         type: string
   *         description: value of event additional info
   *         example: tặng mẹ yêu siêu deal triệu quà
   */

  @ControllerService({
    body: [
      {
        name: 'name',
        type: String,
        validator: (propName: string, value: string) => {
          if (value.length == 0) return `${propName} must be filled in`;
          return null;
        },
      },
      {
        name: 'startingDate',
        type: String,
        validator: (propName: string, value: string) => {
          let startingDate = new Date(ConvertDate(value));
          if (!Date.parse(ConvertDate(value))) return `${propName} is invalid`;
          let now = new Date();
          if (startingDate < now) return `${propName} must be after today`;
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
        type: String,
        validator: (propName: string, value: string) => {
          if (value) {
            if (!JSON.parse('[' + value + ']')) return `${propName} is invalid`;
          }
          return null;
        },
      },
    ],
  })
  static async newEvent(req: Request, res: Response) {
    if (req.file != undefined) {
      const file = req.file;
      const localFile: LocalFile = await UploadModel.upload(file);
      const data = req.body;
      const startingDate = new Date(ConvertDate(data.startingDate));
      const endingDate = new Date(ConvertDate(data.endingDate));
      if (startingDate > endingDate) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .send({ message: 'startingDate must be smaller than endingDate!' });
        return;
      }
      const additionalInfo = JSON.parse('[' + data.additionalInfo + ']');

      const result = await EventModel.newEvent(
        res.locals.user,
        data.name,
        data.content,
        localFile,
        startingDate,
        endingDate,
        additionalInfo
      );
      if (result.getCode() == HttpStatusCode.CREATED)
        res
          .status(result.getCode())
          .send({ message: result.getMessage(), data: result.getData() });
      else res.status(result.getCode()).send({ message: result.getMessage() });
    } else
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ error: 'Please upload event banner' });
  }

  @ControllerService({
    body: [
      {
        name: 'name',
        type: String,
        validator: (propName: string, value: string) => {
          if (value.length == 0) return `${propName} must be filled in`;
          return null;
        },
      },
      {
        name: 'startingDate',
        type: String,
        validator: (propName: string, value: string) => {
          let startingDate = new Date(ConvertDate(value));
          if (!Date.parse(ConvertDate(value))) return `${propName} is invalid`;
          let now = new Date();
          if (startingDate < now) return `${propName} must be after today`;
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
        type: String,
        validator: (propName: string, value: string) => {
          if (value) {
            if (!JSON.parse('[' + value + ']')) return `${propName} is invalid`;
          }
          return null;
        },
      },
    ],
  })
  static async editEvent(req: Request, res: Response) {
    if (req.file != undefined) {
      const file = req.file;
      const id = +req.params.id;
      const data = req.body;
      const startingDate = new Date(ConvertDate(data.startingDate));
      const endingDate = new Date(ConvertDate(data.endingDate));
      // handle starting date and ending date
      if (startingDate > endingDate) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .send({ message: 'startingDate must be smaller than endingDate!' });
        return;
      }
      const additionalInfo = JSON.parse('[' + data.additionalInfo + ']');
      const result = await EventModel.editEvent(
        res.locals.user,
        id,
        data.name,
        data.content,
        file,
        startingDate,
        endingDate,
        additionalInfo
      );
      if (result.getCode() == HttpStatusCode.OK)
        res.status(result.getCode()).send({ message: result.getMessage() });
      else res.status(result.getCode()).send({ message: result.getMessage() });
    } else
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ error: 'Please upload event banner' });
  }

  @ControllerService()
  static async showAllProductsOfEvent(req: Request, res: Response) {
    const eventId = +req.params.eventId;
    const result = await EventModel.showAllProductsOfEvent(eventId);
    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  /**
   * @swagger
   * components:
   *  schemas:
   *   EventProductRequest:
   *    type: object
   *    properties:
   *     productIdList:
   *      type: array
   *      description: product Id list
   *      example: ["32689821-ec65-4439-a6d3-3ff49859faab", "b0aed358-220f-49a4-a555-7a976bfe879f"]
   *     discount:
   *      type: number
   *      format: double
   *      description: discount of event product
   *      example: 0.3
   *     amount:
   *      type: integer
   *      format: int32
   *      description: amount of event product
   *      example: 100
   */
  @ControllerService({
    body: [
      {
        name: 'discount',
        // type: Number,
        validator: (propName: string, value: string) => {
          if (value.length == 0) return `${propName} must be filled in`;
          if (!Number(value)) return `${propName} must be number`;
          return null;
        },
      },
      {
        name: 'productIdList',
        type: Array,
        validator: (propName: string, value: string[]) => {
          if (value.length == 0) return `${propName} must be filled in`;
          return null;
        },
      },
    ],
  })
  static async joinEvent(req: Request, res: Response) {
    const eventId = +req.params.eventId;
    const discount = +req.body.discount;
    const amount = +req.body.amount;
    const productIdList = req.body.productIdList;
    const result = await EventModel.joinEvent(
      eventId,
      productIdList,
      discount,
      amount,
      res.locals.user
    );
    if (result.getCode() == HttpStatusCode.OK)
      res.status(result.getCode()).send({ message: result.getMessage() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService({
    body: [
      {
        name: 'discount',
        // type: Number,
        validator: (propName: string, value: string) => {
          if (value.length == 0) return `${propName} must be filled in`;
          if (!Number(value)) return `${propName} must be number`;
          return null;
        },
      },
      {
        name: 'productIdList',
        type: Array,
        validator: (propName: string, value: string[]) => {
          if (value.length == 0) return `${propName} must be filled in`;
          return null;
        },
      },
    ],
  })
  static async editProductDiscountFromEvent(req: Request, res: Response) {
    const eventId = +req.params.eventId;
    const discount = +req.body.discount;
    const amount = +req.body.amount;
    const productIdList = req.body.productIdList;
    const result = await EventModel.editProductDiscountFromEvent(
      eventId,
      productIdList,
      discount,
      amount,
      res.locals.user
    );
    if (result.getCode() == HttpStatusCode.OK)
      res.status(result.getCode()).send({ message: result.getMessage() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService({
    body: [
      {
        name: 'productIdList',
        type: Array,
        validator: (propName: string, value: string[]) => {
          if (value.length == 0) return `${propName} must be filled in`;
          return null;
        },
      },
    ],
  })
  static async deleteProductsOfEvent(req: Request, res: Response) {
    const eventId = +req.params.eventId;
    const productIdList = req.body.productIdList;
    const result = await EventModel.deleteProductsOfEvent(
      eventId,
      productIdList,
      res.locals.user
    );
    if (result.getCode() == HttpStatusCode.OK)
      res.status(result.getCode()).send({ message: result.getMessage() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async deleteEvent(req: Request, res: Response) {
    const id = +req.params.id;
    const result = await EventModel.deleteEvent(id, res.locals.user);
    if (result.getCode() == HttpStatusCode.OK)
      res.status(result.getCode()).send({ message: result.getMessage() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }
}

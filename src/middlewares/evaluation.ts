import { HttpStatusCode } from './../utils/shopp.enum';
import { ControllerService } from '../utils/decorators';
import { Request, Response } from 'express';
import EvaluationModel from '../models/evaluation';
import { LocalFile } from '../entities/localFile';
import UploadModel from '../models/upload';
import { EntityManager } from 'typeorm';
import { ShopPDataSource } from '../data';

export default class EvaluationMiddleware {
  @ControllerService()
  static async showAllEvaluationsOfProduct(req: Request, res: Response) {
    const result = await EvaluationModel.showAllEvaluationsOfProduct(
      req.params.productId
    );
    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async getEvaluationById(req: Request, res: Response) {
    const result = await EvaluationModel.getEvaluationById(
      +req.params.evaluationId
    );
    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService({
    body: [
      {
        name: 'feedback',
        type: String,
        validator: (propName: string, value: string) => {
          if (value.length < 20)
            return `${propName} must have the shortest length of 20 characters `;
          return null;
        },
      },
      {
        name: 'star',
        validator: (propName: string, value: string) => {
          if (!Number(value)) return `${propName} must be a number `;
          if (Number(value) > 5 || Number(value) < 1)
            return `${propName} must be between 1 and 5`;
          return null;
        },
      },
    ],
  })
  static async postNewEvaluation(req: Request, res: Response) {
    let evaluationImages: LocalFile[] = [];
    if (req.files != undefined) {
      evaluationImages = await UploadModel.uploadMultiple(req.files);

      const result = await EvaluationModel.postNewEvaluation(
        new EntityManager(ShopPDataSource),
        req.params.orderProductId,
        req.body.feedback,
        req.body.star,
        evaluationImages,
        res.locals.user
      );
      if (result.getCode() == HttpStatusCode.OK)
        res
          .status(result.getCode())
          .send({ message: result.getMessage(), data: result.getData() });
      else res.status(result.getCode()).send({ message: result.getMessage() });
    } else
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ error: 'Please upload evaluation images' });
  }

  @ControllerService({
    body: [
      {
        name: 'feedback',
        type: String,
        validator: (propName: string, value: string) => {
          if (value.length < 20)
            return `${propName} must have the shortest length of 20 characters `;
          return null;
        },
      },
      {
        name: 'star',
        validator: (propName: string, value: string) => {
          if (!Number(value)) return `${propName} must be a number `;
          if (Number(value) > 5 || Number(value) < 1)
            return `${propName} must be between 1 and 5`;
          return null;
        },
      },
    ],
  })
  static async editEvaluation(req: Request, res: Response) {
    let evaluationImages: LocalFile[] = [];
    if (req.files) {
      evaluationImages = await UploadModel.uploadMultiple(req.files);
      const result = await EvaluationModel.editEvaluation(
        +req.params.evaluationId,
        req.body.feedback,
        req.body.star,
        evaluationImages,
        res.locals.user
      );
      if (result.getCode() == HttpStatusCode.OK)
        res
          .status(result.getCode())
          .send({ message: result.getMessage(), data: result.getData() });
      else res.status(result.getCode()).send({ message: result.getMessage() });
    } else
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ error: 'Please upload evaluation images' });
  }

  @ControllerService()
  static async deleteEvaluation(req: Request, res: Response) {
    const result = await EvaluationModel.deleteEvaluation(
      +req.params.evaluationId,
      res.locals.user
    );
    res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async alterLikesOfEvaluation(req: Request, res: Response) {
    const result = await EvaluationModel.alterLikesOfEvaluation(
      +req.params.evaluationId,
      res.locals.user
    );
    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }
}

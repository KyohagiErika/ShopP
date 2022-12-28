import EvaluationReportModel from '../models/evaluationReport';
import { ControllerService } from '../utils/decorators';
import { Request, Response } from 'express';
import {
  HttpStatusCode,
  ReasonEvaluationReportEnum,
} from '../utils/shopp.enum';

export default class EvaluationReportMiddleware {
  @ControllerService()
  static async getAllEvaluationsReports(req: Request, res: Response) {
    const result = await EvaluationReportModel.getAllEvaluationsReports();
    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async getEvaluationsReportsByEvaluationId(
    req: Request,
    res: Response
  ) {
    const result =
      await EvaluationReportModel.getEvaluationsReportsByEvaluationId(
        +req.params.evaluationId
      );
    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async getEvaluationsReportById(req: Request, res: Response) {
    const result = await EvaluationReportModel.getEvaluationsReportById(
      +req.params.evaluationReportId,
      res.locals.user
    );
    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async getEvaluationsReportsofReporter(req: Request, res: Response) {
    const result = await EvaluationReportModel.getEvaluationsReportsofReporter(
      res.locals.user
    );
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
   *   EvaluationReportRequest:
   *    type: object
   *    properties:
   *     reason:
   *      #ref: '#/components/schemas/ReasonEvaluationReportEnum'
   *     description:
   *      type: string
   *      description: description of evaluation report
   *      example: He said some things not good about the product but it is not true
   */
  @ControllerService({
    body: [
      {
        name: 'reason',
        type: String,
        validator: (propName: string, value: string) => {
          if (value.length == 0) return `${propName} must be filled in`;
          const reasonList = Object.entries(ReasonEvaluationReportEnum).map(
            ([key, value]) => {
              return key;
            }
          );
          if (!reasonList.includes(value.toUpperCase()))
            return `${propName} is invalid`;
          return null;
        },
      },
      {
        name: 'description',
        type: String,
        validator: (propName: string, value: string) => {
          if (value.length == 0) return `${propName} must be filled in`;
          return null;
        },
      },
    ],
  })
  static async newEvaluationReport(req: Request, res: Response) {
    const { reason, description } = req.body;
    const result = await EvaluationReportModel.newEvaluationReport(
      +req.params.evaluationId,
      reason,
      description,
      res.locals.user
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
        name: 'reason',
        type: String,
        validator: (propName: string, value: string) => {
          const reasonList = Object.entries(ReasonEvaluationReportEnum).map(
            ([key, value]) => {
              return key;
            }
          );
          if (!reasonList.includes(value.toUpperCase()))
            return `${propName} is invalid`;
          return null;
        },
      },
      {
        name: 'description',
        type: String,
        validator: (propName: string, value: string) => {
          if (value.length == 0) return `${propName} must be filled in`;
          return null;
        },
      },
    ],
  })
  static async editEvaluationReport(req: Request, res: Response) {
    const { reason, description } = req.body;
    const result = await EvaluationReportModel.editEvaluationReport(
      +req.params.evaluationReportId,
      reason,
      description,
      res.locals.user
    );
    if (result.getCode() == HttpStatusCode.OK)
      res
        .status(result.getCode())
        .send({ message: result.getMessage(), data: result.getData() });
    else res.status(result.getCode()).send({ message: result.getMessage() });
  }
}

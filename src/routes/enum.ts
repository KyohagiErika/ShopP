import { Request, Response, Router } from 'express';
import { enumToArray } from '../utils';
import {
  DeliveryStatusEnum,
  GenderEnum,
  HttpStatusCode,
  OtpEnum,
  ProductEnum,
  ReasonEvaluationReportEnum,
  RoleEnum,
  StatusEnum,
  StatusReportEnum,
  TitleStatusEnum,
  TypeTransferEnum,
  VoucherTypeEnum,
} from '../utils/shopp.enum';

const routes = Router();

/**
 * @swagger
 * /enum/http-status-code:
 *  get:
 *   tags:
 *    - Enum
 *   summary: Get Http Status Code Enum
 *   description: Get Http Status Code Enum
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EnumList'
 */
routes.get('/http-status-code', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(enumToArray(HttpStatusCode));
});

/**
 * @swagger
 * /enum/status:
 *  get:
 *   tags:
 *    - Enum
 *   summary: Get Status Enum
 *   description: Get Status Enum
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EnumList'
 */
routes.get('/status', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(enumToArray(StatusEnum));
});

/**
 * @swagger
 * /enum/role:
 *  get:
 *   tags:
 *    - Enum
 *   summary: Get Role Enum
 *   description: Get Role Enum
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EnumList'
 */
routes.get('/role', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(enumToArray(RoleEnum));
});

/**
 * @swagger
 * /enum/gender:
 *  get:
 *   tags:
 *    - Enum
 *   summary: Get Gender Enum
 *   description: Get Gender Enum
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EnumList'
 */
routes.get('/gender', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(enumToArray(GenderEnum));
});

/**
 * @swagger
 * /enum/otp:
 *  get:
 *   tags:
 *    - Enum
 *   summary: Get OTP Enum
 *   description: Get OTP Enum
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EnumList'
 */
routes.get('/otp', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(enumToArray(OtpEnum));
});

/**
 * @swagger
 * /enum/product:
 *  get:
 *   tags:
 *    - Enum
 *   summary: Get Product Enum
 *   description: Get Product Enum
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EnumList'
 */
routes.get('/product', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(enumToArray(ProductEnum));
});

/**
 * @swagger
 * /enum/voucher:
 *  get:
 *   tags:
 *    - Enum
 *   summary: Get Voucher Enum
 *   description: Get Voucher Enum
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EnumList'
 */
routes.get('/voucher', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(enumToArray(VoucherTypeEnum));
});

/**
 * @swagger
 * /enum/type-transfer:
 *  get:
 *   tags:
 *    - Enum
 *   summary: Get Type Transfer Enum
 *   description: Get Type Transfer Enum
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EnumList'
 */
routes.get('/type-transfer', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(enumToArray(TypeTransferEnum));
});

/**
 * @swagger
 * /enum/status-report:
 *  get:
 *   tags:
 *    - Enum
 *   summary: Get Status Report Enum
 *   description: Get Status Report Enum
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EnumList'
 */
routes.get('/status-report', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(enumToArray(StatusReportEnum));
});

/**
 * @swagger
 * /enum/reason-evaluation-report:
 *  get:
 *   tags:
 *    - Enum
 *   summary: Get Reason Evaluation Report Enum
 *   description: Get Reason Evaluation Report Enum
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EnumList'
 */
routes.get('/reason-evaluation-report', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(enumToArray(ReasonEvaluationReportEnum));
});

/**
 * @swagger
 * /enum/delivery-status:
 *  get:
 *   tags:
 *    - Enum
 *   summary: Get Delivery Status Enum
 *   description: Get Delivery Status Enum
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EnumList'
 */
routes.get('/delivery-status', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(enumToArray(DeliveryStatusEnum));
});

/**
 * @swagger
 * /enum/tracking-status:
 *  get:
 *   tags:
 *    - Enum
 *   summary: Get Title Status Enum
 *   description: Get Title Status Enum
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EnumList'
 */
routes.get('/tracking-status', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(enumToArray(TitleStatusEnum));
});

export default routes;

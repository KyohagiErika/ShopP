import { Request, Response, Router } from 'express';
import { enumToArray } from '../utils';
import {
  DeliveryStatusEnum,
  GenderEnum,
  HttpStatusCode,
  OtpEnum,
  ProductEnum,
  RoleEnum,
  StatusEnum,
  StatusReportEnum,
  TypeTransferEnum,
  VoucherTypeEnum,
} from '../utils/shopp.enum';

const routes = Router();

routes.get('/http-status-code', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(enumToArray(HttpStatusCode));
});

routes.get('/status', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(enumToArray(StatusEnum));
});

routes.get('/role', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(enumToArray(RoleEnum));
});

routes.get('/gender', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(enumToArray(GenderEnum));
});

routes.get('/otp', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(enumToArray(OtpEnum));
});

routes.get('/product', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(enumToArray(ProductEnum));
});

routes.get('/voucher', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(enumToArray(VoucherTypeEnum));
});

routes.get('/type-transfer', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(enumToArray(TypeTransferEnum));
});

routes.get('/status-report', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(enumToArray(StatusReportEnum));
});

routes.get('/delivery-status', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send(enumToArray(DeliveryStatusEnum));
});

export default routes;

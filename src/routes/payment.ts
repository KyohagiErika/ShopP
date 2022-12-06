import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import PaymentMiddleware from '../middlewares/payment';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

routes.get(
  '/list-all',
  PaymentMiddleware.listAll
);

routes.get(
  '/:id([0-9]+)',
  PaymentMiddleware.getOneById
);

routes.post(
  '/new',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  PaymentMiddleware.postNew
);

export default routes;

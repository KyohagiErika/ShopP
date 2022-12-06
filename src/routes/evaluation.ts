import { uploadMultipleImage } from './../middlewares/fileProvider';
import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import EvaluationMiddleware from '../middlewares/evaluation';
import { RoleEnum } from '../utils/shopp.enum';
const routes = Router();

// list all evaluations of product
routes.get(
  '/list-all/:productId',
  [AuthMiddleware.checkJwt],
  EvaluationMiddleware.showAllEvaluationsOfProduct
);

// get evaluation by id
routes.get(
  '/:evaluationId',
  [AuthMiddleware.checkJwt],
  EvaluationMiddleware.getEvaluationById
);

// post new evaluation
routes.post(
  '/new/:orderProductId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  uploadMultipleImage('evaluationImages'),
  EvaluationMiddleware.postNewEvaluation
);

// edit evaluation
routes.post(
  '/edit/:evaluationId([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  uploadMultipleImage('evaluationImages'),
  EvaluationMiddleware.editEvaluation
);

// deleteEvaluation
routes.get(
  '/delete/:evaluationId([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  EvaluationMiddleware.deleteEvaluation
);

// alter Likes number of evaluation
routes.get(
  '/alter-likes/:evaluationId([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  EvaluationMiddleware.alterLikesOfEvaluation
);

export default routes;

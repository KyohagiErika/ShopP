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
  [AuthMiddleware.checkJwt],
  uploadMultipleImage('evaluationImages'),
  EvaluationMiddleware.postNewEvaluation
);

// edit evaluation
routes.post(
  '/edit/:evaluationId([0-9]+)',
  [AuthMiddleware.checkJwt],
  EvaluationMiddleware.editEvaluation
);

// deleteEvaluation
routes.post(
  '/delete/:evaluationId([0-9]+)',
  [AuthMiddleware.checkJwt],
  EvaluationMiddleware.deleteEvaluation
);

export default routes;
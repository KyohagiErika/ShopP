import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import { RoleEnum } from '../utils/shopp.enum';
import EvaluationReportMiddleware from '../middlewares/evaluationReport';

const routes = Router();

/**
 * @swagger
 * /evaluation-report/list-all:
 *  get:
 *   tags:
 *    - Evaluation Report
 *   security:
 *    - bearerAuth: []
 *   summary: Get all evaluation reports
 *   description: Get all evaluation reports
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EvaluationReportListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/list-all',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  EvaluationReportMiddleware.getAllEvaluationsReports
);

/**
 * @swagger
 * /evaluation-report/list-by-evaluation/{evaluationId}:
 *  get:
 *   tags:
 *    - Evaluation Report
 *   security:
 *    - bearerAuth: []
 *   summary: Get evaluation reports from an evaluation
 *   description: Get evaluation reports from an evaluation
 *   parameters:
 *    - in: path
 *      name: evaluationId
 *      schema:
 *       type: number
 *      required: true
 *      description: id of evaluation
 *      example: 1
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EvaluationReportListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/list-by-evaluation/:evaluationId([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  EvaluationReportMiddleware.getEvaluationsReportsByEvaluationId
);

/**
 * @swagger
 * /evaluation-report/list-by-id/{evaluationReportId}:
 *  get:
 *   tags:
 *    - Evaluation Report
 *   security:
 *    - bearerAuth: []
 *   summary: Get a evaluation report by id
 *   description: Get a evaluation report by id
 *   parameters:
 *    - in: path
 *      name: evaluationReportId
 *      schema:
 *       type: number
 *      required: true
 *      description: id of evaluation report
 *      example: 1
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EvaluationReportResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/list-by-id/:evaluationReportId([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  EvaluationReportMiddleware.getEvaluationsReportById
);

/**
 * @swagger
 * /evaluation-report/list-of-user:
 *  get:
 *   tags:
 *    - Evaluation Report
 *   security:
 *    - bearerAuth: []
 *   summary: Get a evaluation report by id
 *   description: Get a evaluation report by id
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EvaluationReportListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/list-of-user',
  [AuthMiddleware.checkJwt],
  EvaluationReportMiddleware.getEvaluationsReportsofReporter
);

/**
 * @swagger
 * /evaluation-report/new/{evaluationId}:
 *  post:
 *   tags:
 *    - Evaluation Report
 *   security:
 *    - bearerAuth: []
 *   summary: Create new evaluation report
 *   description: Create new evaluation report
 *   parameters:
 *    - in: path
 *      name: evaluationId
 *      schema:
 *       type: number
 *      required: true
 *      description: id of evaluation
 *      example: 1
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/EvaluationReportRequest'
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EvaluationReportResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/new/:evaluationId([0-9]+)',
  [AuthMiddleware.checkJwt],
  EvaluationReportMiddleware.newEvaluationReport
);

/**
 * @swagger
 * /evaluation-report/edit/{evaluationReportId}:
 *  post:
 *   tags:
 *    - Evaluation Report
 *   security:
 *    - bearerAuth: []
 *   summary: Edit evaluation report
 *   description: Edit evaluation report
 *   parameters:
 *    - in: path
 *      name: evaluationReportId
 *      schema:
 *       type: number
 *      required: true
 *      description: id of evaluation report
 *      example: 1
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/EvaluationReportRequest'
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EvaluationReportResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/edit/:evaluationReportId([0-9]+)',
  [AuthMiddleware.checkJwt],
  EvaluationReportMiddleware.editEvaluationReport
);

export default routes;

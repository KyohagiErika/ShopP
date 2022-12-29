import { uploadMultipleImage } from './../middlewares/fileProvider';
import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import EvaluationMiddleware from '../middlewares/evaluation';
import { RoleEnum } from '../utils/shopp.enum';
const routes = Router();

/**
 * @swagger
 * /evaluation/list-all/{productId}:
 *  get:
 *   tags:
 *    - Evaluation
 *   security:
 *    - bearerAuth: []
 *   summary: Get all evaluations
 *   description: Get all evaluations
 *   parameters:
 *    - in: path
 *      name: productId
 *      schema:
 *       type: string
 *       format: uuid
 *      required: true
 *      description: id of product
 *      example: 1d07e98f-7005-4035-acd8-eb4b7126da5a
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EvaluationListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/list-all/:productId',
  [AuthMiddleware.checkJwt],
  EvaluationMiddleware.showAllEvaluationsOfProduct
);

/**
 * @swagger
 * /evaluation/{evaluationId}:
 *  get:
 *   tags:
 *    - Evaluation
 *   security:
 *    - bearerAuth: []
 *   summary: Get evaluation by id
 *   description: Get evaluation by id
 *   parameters:
 *    - in: path
 *      name: evaluationId
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of evaluation
 *      example: 6
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EvaluationResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/:evaluationId',
  [AuthMiddleware.checkJwt],
  EvaluationMiddleware.getEvaluationById
);

/**
 * @swagger
 * /evaluation/new/{orderProductId}:
 *  post:
 *   tags:
 *    - Evaluation
 *   security:
 *    - bearerAuth: []
 *   summary: Create new evaluation (CUSTOMER)
 *   description: Create new evaluation (CUSTOMER)
 *   parameters:
 *    - in: path
 *      name: orderProductId
 *      schema:
 *       type: string
 *       format: uuid
 *      required: true
 *      description: id of order product
 *      example: 14f7a665-6594-402c-8383-13ac0601a767
 *   requestBody:
 *    content:
 *     multipart/form-data:
 *      schema:
 *       $ref: '#/components/schemas/EvaluationRequest'
 *      encoding:
 *       evaluationImages:
 *        contentType: image/png, image/jpeg, image/jpg, image/gif
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EvaluationResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/new/:orderProductId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  uploadMultipleImage('evaluationImages'),
  EvaluationMiddleware.postNewEvaluation
);

/**
 * @swagger
 * /evaluation/edit/{evaluationId}:
 *  post:
 *   tags:
 *    - Evaluation
 *   security:
 *    - bearerAuth: []
 *   summary: Edit evaluation (CUSTOMER)
 *   description: Edit evaluation (CUSTOMER)
 *   parameters:
 *    - in: path
 *      name: evaluationId
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of evaluation
 *      example: 6
 *   requestBody:
 *    content:
 *     multipart/form-data:
 *      schema:
 *       $ref: '#/components/schemas/EvaluationRequest'
 *      encoding:
 *       evaluationImages:
 *        contentType: image/png, image/jpeg, image/jpg, image/gif
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EvaluationResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/edit/:evaluationId([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  uploadMultipleImage('evaluationImages'),
  EvaluationMiddleware.editEvaluation
);

/**
 * @swagger
 * /evaluation/delete/{evaluationId}:
 *  get:
 *   tags:
 *    - Evaluation
 *   security:
 *    - bearerAuth: []
 *   summary: Delete evaluation (CUSTOMER)
 *   description: Delete evaluation (CUSTOMER)
 *   parameters:
 *    - in: path
 *      name: evaluationId
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of evaluation
 *      example: 6
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/delete/:evaluationId([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  EvaluationMiddleware.deleteEvaluation
);

/**
 * @swagger
 * /evaluation/alter-likes/{evaluationId}:
 *  get:
 *   tags:
 *    - Evaluation
 *   security:
 *    - bearerAuth: []
 *   summary: Alter number of likes of evaluation (CUSTOMER)
 *   description: Alter number of likes of evaluation (CUSTOMER)
 *   parameters:
 *    - in: path
 *      name: evaluationId
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of evaluation
 *      example: 6
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         likes:
 *          type: integer
 *          description: number of likes of evaluation
 *          example: 10
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/alter-likes/:evaluationId([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  EvaluationMiddleware.alterLikesOfEvaluation
);

export default routes;

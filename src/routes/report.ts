import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import ReportMiddleware from '../middlewares/report';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

/**
 * @swagger
 * /report/in-process:
 *  get:
 *   tags:
 *    - Report
 *   security:
 *    - bearerAuth: []
 *   summary: Get all reports in process (ADMIN)
 *   description: Get all reports in process (ADMIN)
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ReportListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/in-process',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  ReportMiddleware.listAllReportInProcess
);

/**
 * @swagger
 * /report/processed:
 *  get:
 *   tags:
 *    - Report
 *   security:
 *    - bearerAuth: []
 *   summary: Get all reports processed (ADMIN)
 *   description: Get all reports processed (ADMIN)
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ReportListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/processed',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  ReportMiddleware.listAllReportProcessed
);

/**
 * @swagger
 * /report/view-report/{id}:
 *  get:
 *   tags:
 *    - Report
 *   security:
 *    - bearerAuth: []
 *   summary: Get one report (ADMIN)
 *   description: Get one report (ADMIN)
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *       format: int32
 *      required: true
 *      description: id of the report
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ReportResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/view-report/:id([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  ReportMiddleware.viewReport
);

/**
 * @swagger
 * /report/new-for-customer/{shopId}:
 *  post:
 *   tags:
 *    - Report
 *   security:
 *    - bearerAuth: []
 *   summary: Create a new report to shop (CUSTOMER)
 *   description: Create a report to shop (CUSTOMER)
 *   parameters:
 *    - in: path
 *      name: shopId
 *      schema:
 *       type: string
 *       required: true
 *       description: shopId of the report
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/ReportRequest'
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/new-for-customer/:shopId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  ReportMiddleware.postNewForCustomer
);

/**
 * @swagger
 * /report/new-for-shop/{customerId}:
 *  post:
 *   tags:
 *    - Report
 *   security:
 *    - bearerAuth: []
 *   summary: Create a new report to customer (SHOP)
 *   description: Create a report to customer (SHOP)
 *   parameters:
 *    - in: path
 *      name: customerId
 *      schema:
 *       type: string
 *       required: true
 *       description: customerId of the report
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/ReportRequest'
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/new-for-shop/:customerId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ReportMiddleware.postNewForShop
);

/**
 * @swagger
 * /report/edit-status/{id}:
 *  post:
 *   tags:
 *    - Report
 *   security:
 *    - bearerAuth: []
 *   summary: Edit report status (ADMIN)
 *   description: Edit report status (ADMIN)
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *       format: int32
 *      required: true
 *      description: id of the report
 *      example: 1
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/edit-status/:id([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  ReportMiddleware.editStatus
);

export default routes;

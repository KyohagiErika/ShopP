import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import PaymentMiddleware from '../middlewares/payment';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

/**
 * @swagger
 * /payment/list-all:
 *  get:
 *   tags:
 *    - Payment
 *   security:
 *    - bearerAuth: []
 *   summary: List all payments (Customer)
 *   description: List all payments (Customer)
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/PaymentListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/list-all',
  PaymentMiddleware.listAll
);

/**
 * @swagger
 * /payment/{id}:
 *  get:
 *   tags:
 *    - Payment
 *   security:
 *    - bearerAuth: []
 *   summary: Get one payment (Customer)
 *   description: Get one payment (Customer)
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *       format: int32
 *      required: true
 *      description: id of the payment
 *      example: 1
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *         $ref: '#/components/schemas/PaymentResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/:id([0-9]+)',
  PaymentMiddleware.getOneById
);

/**
 * @swagger
 * /payment/new:
 *  post:
 *   tags:
 *    - Payment
 *   security:
 *    - bearerAuth: []
 *   summary: Create a new payment (admin)
 *   description: Create a new payment (admin)
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/PaymentRequest'
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/new',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  PaymentMiddleware.postNew
);

export default routes;

import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import OrderMiddleware from '../middlewares/order';
import TransportFeeMiddleware from '../middlewares/transportFee';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

/**
 * @swagger
 * /transport-fee/get/{shopId}:
 *  get:
 *   tags:
 *    - Transport Fee
 *   security:
 *    - bearerAuth: []
 *   summary: Get Transport Fee when ship from shop to customer (CUSTOMER)
 *   description: Get Transport Fee when ship from shop to customer (CUSTOMER)
 *   parameters:
 *    - in: path
 *      name: shopId
 *      schema:
 *       type: string
 *      required: true
 *      description: id of the shop
 *      example: 27580e3b-6953-43cc-a482-eaa62b997883
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         transportFee:
 *          type: number
 *          example: 10000
 *          description: Transport fee
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 *    404:
 *     $ref: '#/components/responses/404NotFound'
 */
routes.get(
  '/get/:shopId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  TransportFeeMiddleware.getTransportFee
);

/**
 * @swagger
 * /transport-fee/valid/{address}:
 *  get:
 *   tags:
 *    - Transport Fee
 *   summary: Valid address
 *   description: Valid address
 *   parameters:
 *    - in: path
 *      name: address
 *      schema:
 *       type: string
 *      required: true
 *      description: address
 *      example: 23 Xuan Thuy, Ha Noi, Viet Nam
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 */
routes.get('/valid/:address', TransportFeeMiddleware.validAddress);

export default routes;

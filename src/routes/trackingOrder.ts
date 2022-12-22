import { Router } from "express";
import AuthMiddleware from "../middlewares/auth";
import TrackingOrderMiddleware from "../middlewares/trackingOrder";

const routes = Router();
/**
 * @swagger
 * /tracking-order/view/{id}:
 *  get:
 *   tags:
 *    - Tracking Order
 *   security:
 *    - bearerAuth: []
 *   summary: Get all tracking of order 
 *   description: Get all tracking of order 
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *       format: uuid
 *      required: true
 *      description: id of the order
 *      example: '27580e3b-6953-43cc-a482-eaa62b997883'
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *         $ref: '#/components/schemas/TrackingListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
    '/view/:orderId', [AuthMiddleware.checkJwt],
    TrackingOrderMiddleware.viewTrackingOrder
);

/**
 * @swagger
 * /tracking-order/get-one/{id}:
 *  get:
 *   tags:
 *    - Tracking Order
 *   security:
 *    - bearerAuth: []
 *   summary: Get one tracking of order 
 *   description: Get one tracking of order 
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *       format: int32
 *      required: true
 *      description: id of the tracking order
 *      example: '31'
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *         $ref: '#/components/schemas/trackingResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
    '/get-one/:id([0-9]+)', [AuthMiddleware.checkJwt],
    TrackingOrderMiddleware.getOneById
);

export default routes;
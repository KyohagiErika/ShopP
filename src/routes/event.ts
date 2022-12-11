import { Router } from 'express';
import EventMiddleware from '../middlewares/event';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import { RoleEnum } from '../utils/shopp.enum';
import { uploadImage } from '../middlewares/fileProvider';
const routes = Router();

/**
 * @swagger
 * /event/list-admin-events:
 *  get:
 *   tags:
 *    - Event
 *   security:
 *    - bearerAuth: []
 *   summary: List admin events
 *   description: List admin events
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EventListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/list-admin-events',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  EventMiddleware.listAll
);

/**
 * @swagger
 * /event/list-shop-events:
 *  get:
 *   tags:
 *    - Event
 *   security:
 *    - bearerAuth: []
 *   summary: List shop events
 *   description: List shop events
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EventListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/list-shop-events',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  EventMiddleware.listShopEvents
);

/**
 * @swagger
 * /event/new:
 *  post:
 *   tags:
 *    - Event
 *   security:
 *    - bearerAuth: []
 *   summary: Create new event
 *   description: Create new event
 *   requestBody:
 *    content:
 *     multipart/form-data:
 *      schema:
 *       $ref: '#/components/schemas/EventRequest'
 *      encoding:
 *       banner:
 *        contentType: image/png, image/jpeg, image/jpg, image/gif
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EventResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/new',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  uploadImage('banner'),
  EventMiddleware.newEvent
);

/**
 * @swagger
 * /event/{id}:
 *  post:
 *   tags:
 *    - Event
 *   security:
 *    - bearerAuth: []
 *   summary: Edit event
 *   description: Edit event
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: number
 *      required: true
 *      description: id of event
 *      example: 3
 *   requestBody:
 *    content:
 *     multipart/form-data:
 *      schema:
 *       $ref: '#/components/schemas/EventRequest'
 *      encoding:
 *       banner:
 *        contentType: image/png, image/jpeg, image/jpg, image/gif
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EventResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/:id([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  uploadImage('banner'),
  EventMiddleware.editEvent
);

/**
 * @swagger
 * /event/delete/{id}:
 *  get:
 *   tags:
 *    - Event
 *   security:
 *    - bearerAuth: []
 *   summary: Delete event
 *   description: Delete event
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: number
 *      required: true
 *      description: id of event
 *      example: 3
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/delete/:id([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  EventMiddleware.deleteEvent
);

/**
 * @swagger
 * /event/{id}:
 *  get:
 *   tags:
 *    - Event
 *   security:
 *    - bearerAuth: []
 *   summary: Find event by id
 *   description: Find event by id
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: number
 *      required: true
 *      description: id of event
 *      example: 3
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EventResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/:id([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  EventMiddleware.findEventById
);

/**
 * @swagger
 * /event/join-event/{eventId}:
 *  post:
 *   tags:
 *    - Event
 *   security:
 *    - bearerAuth: []
 *   summary: Join event
 *   description: Join event
 *   parameters:
 *    - in: path
 *      name: eventId
 *      schema:
 *       type: number
 *      required: true
 *      description: id of event
 *      example: 3
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/EventProductRequest'
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/join-event/:eventId([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  EventMiddleware.joinEvent
);

/**
 * @swagger
 * /event/edit-products-discount/{eventId}:
 *  post:
 *   tags:
 *    - Event
 *   security:
 *    - bearerAuth: []
 *   summary: Edit discount of products in event
 *   description: Edit discount of products in event
 *   parameters:
 *    - in: path
 *      name: eventId
 *      schema:
 *       type: number
 *      required: true
 *      description: id of event
 *      example: 3
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/EventProductRequest'
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/edit-products-discount/:eventId([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  EventMiddleware.editProductDiscountFromEvent
);

/**
 * @swagger
 * /event/delete-products/{eventId}:
 *  post:
 *   tags:
 *    - Event
 *   security:
 *    - bearerAuth: []
 *   summary: Delete products from event
 *   description: Delete products from event
 *   parameters:
 *    - in: path
 *      name: eventId
 *      schema:
 *       type: number
 *      required: true
 *      description: id of event
 *      example: 3
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        productIdList:
 *         type: array
 *         description: product Id list
 *         example: ["32689821-ec65-4439-a6d3-3ff49859faab", "b0aed358-220f-49a4-a555-7a976bfe879f"]
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.post(
  '/delete-products/:eventId([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  EventMiddleware.deleteProductsOfEvent
);

/**
 * @swagger
 * /event/show-products/{eventId}:
 *  get:
 *   tags:
 *    - Event
 *   security:
 *    - bearerAuth: []
 *   summary: Show all products of event
 *   description: Show all products of event
 *   parameters:
 *    - in: path
 *      name: eventId
 *      schema:
 *       type: number
 *      required: true
 *      description: id of event
 *      example: 3
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/EventProductListResponse'
 *    400:
 *     $ref: '#/components/responses/400BadRequest'
 *    401:
 *     $ref: '#/components/responses/401Unauthorized'
 */
routes.get(
  '/show-products/:eventId([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  EventMiddleware.showAllProductsOfEvent
);

export default routes;

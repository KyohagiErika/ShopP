import { Router } from 'express';
import auth from './auth';
import user from './user';
import upload from './upload';
import shop from './shop';
import customer from './customer';
import cart from './cart';
import event from './event';
import product from './product';
import category from './category';
import productAdditionalInfo from './productAdditionalInfo';
import packagedProductSize from './packagedProductSize';
import voucher from './voucher';
import report from './report';
import order from './order';
import payment from './payment';
import shoppingUnit from './shoppingUnit';
import orderProduct from './orderProduct';
import enumeration from './enum';
import evaluation from './evaluation';
import swagger from './swagger';
import UploadModel from '../models/upload';
import trackingOrder from './trackingOrder'

const routes = Router();
/**
 * @swagger
 * components:
 *  responses:
 *   200OK:
 *    type: object
 *    description: Success
 *    properties:
 *     message:
 *      type: string
 *      description: Message Response
 *   302Redirect:
 *    type: object
 *    description: Redirect
 *    properties:
 *     message:
 *      type: string
 *      description: Message Response
 *   400BadRequest:
 *    type: object
 *    description: Bad Request
 *    properties:
 *     message:
 *      type: string
 *      description: Message Response
 *   401Unauthorized:
 *    type: object
 *    description: Unauthorized
 *    properties:
 *     message:
 *      type: string
 *      description: Message Response
 *   403Forbidden:
 *    type: object
 *    description: Forbidden
 *    properties:
 *     message:
 *      type: string
 *      description: Message Response
 *   404NotFound:
 *    type: object
 *    description: Not Found
 *    properties:
 *     message:
 *      type: string
 *      description: Message Response
 *   500InternalServerError:
 *    type: object
 *    description: Internal Server Error
 *    properties:
 *     message:
 *      type: string
 *      description: Message Response
 *   520UnknownError:
 *    type: object
 *    description: Unknown Error
 *    properties:
 *     message:
 *      type: string
 *      description: Message Response
 */
routes.use('/get', async (req, res) => {
  res.send('Hello World!');
});
routes.use('/api-docs', swagger);
routes.use('/auth', auth);
routes.use('/account', user);
routes.use('/upload', upload);
routes.use('/shop', shop);
routes.use('/customer', customer);
routes.use('/cart', cart);
routes.use('/event', event);
routes.use('/voucher', voucher);
routes.use('/product', product);
routes.use('/category', category);
routes.use('/product-additional-info', productAdditionalInfo);
routes.use('/packaged-product-size', packagedProductSize);
routes.use('/report', report);
routes.use('/order', order);
routes.use('/payment', payment);
routes.use('/shopping-unit', shoppingUnit);
routes.use('/order-product', orderProduct);
routes.use('/enum', enumeration);
routes.use('/evaluation', evaluation);
routes.use('/tracking-order', trackingOrder);

/**
 * @swagger
 * /file/{name}:
 *  get:
 *   tags:
 *    - File
 *   summary: Get one file
 *   description: Get one file
 *   parameters:
 *    - in: path
 *      name: name
 *      schema:
 *       type: string
 *       required: true
 *       description: filename of the file
 *   responses:
 *    200:
 *     $ref: '#/components/responses/200OK'
 *    404:
 *     $ref: '#/components/responses/404NotFound'
 */
routes.get('/file/:name', UploadModel.getImage);

routes.use(async (req, res) => {
  res.status(404).send('Not found!');
});

export default routes;

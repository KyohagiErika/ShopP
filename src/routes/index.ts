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
import orderProduct from './orderProduct'
import swagger from './swagger';

const routes = Router();

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
routes.use('/order-product', orderProduct)

routes.use(async (req, res) => {
  res.status(404).send('Not found!');
});

export default routes;

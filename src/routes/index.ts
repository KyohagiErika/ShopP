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

const routes = Router();

routes.use('/auth', auth);
routes.use('/account', user);
routes.use('/upload', upload);
routes.use('/shop', shop);
routes.use('/customer', customer);
routes.use('/cart', cart);
routes.use('/event', event);
routes.use('/voucher', voucher);

routes.use('/get', async (req, res) => {
  res.send('Hello World!');
});
routes.use('/product', product);
routes.use('/category', category);
routes.use('/product-additional-info', productAdditionalInfo);
routes.use('/packaged-product-size', packagedProductSize);

routes.use(async (req, res) => {
  res.status(404).send('Not found!');
});

export default routes;

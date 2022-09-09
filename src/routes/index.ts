import { Router } from 'express';
import auth from './auth';
import user from './user';
import upload from './upload';
import shop from './shop';
import customer from './customer';

const routes = Router();

routes.use('/auth', auth);
routes.use('/user', user);
routes.use('/upload', upload);
routes.use('/shop', shop);
routes.use('/customer', customer);

routes.use(async (req, res) => {
  res.status(404).send('Not found!');
});

export default routes;

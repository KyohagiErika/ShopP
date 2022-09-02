import { Router } from 'express';
import auth from './auth';
import user from './user';

const routes = Router();

routes.use('/auth', auth);
routes.use('/user', user);

routes.use(async (req, res) => {
  res.status(404).send('Not found!');
});

export default routes;

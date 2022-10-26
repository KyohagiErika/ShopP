import { Router } from 'express';
import CategoryMiddleware from '../middlewares/category';
import { uploadImage } from '../middlewares/fileProvider';

const routes = Router();

routes.get('/list-all', CategoryMiddleware.listAll);

routes.get('/:id([0-9]+)', CategoryMiddleware.getOneById);

routes.post('/new', uploadImage('image'), CategoryMiddleware.postNew);

export default routes;

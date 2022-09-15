import { Router } from 'express';
import EventMiddleware from '../middlewares/event';

const routes = Router();

// list events created by admin
routes.get('/list-all', EventMiddleware.listAll);

// list events created by shop
routes.get('/list-shop-events/:userId', EventMiddleware.listShopEvents);

// create a new event
routes.post('/new/:userId([0-9]+)', EventMiddleware.newEvent);

// edit an event
routes.post('/:id([0-9]+)', EventMiddleware.editEvent);

// delete an event
routes.post('/delete/:id([0-9]+)', EventMiddleware.deleteEvent);

export default routes;

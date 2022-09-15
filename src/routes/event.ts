import { Router } from 'express';
import EventMiddleware from '../middlewares/event';

const routes = Router();

// list events created by admin
routes.get('/list-admin-events', EventMiddleware.listAdminEvents);

// list events created by shop
routes.get('/list-shop-events', EventMiddleware.listShopEvents);

// create a new event
routes.post('/new/:userId([0-9]+)', EventMiddleware.listShopEvents);

// edit an event
routes.post('/:id([0-9]+)',EventMiddleware.editEvent)

// delete an event
routes.post('/delete/:id([0-9]+)',EventMiddleware.deleteEvent)

export default routes;

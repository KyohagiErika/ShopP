import { Router } from 'express';
import EventMiddleware from '../middlewares/event';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import { RoleEnum } from '../utils/shopp.enum';
const routes = Router();

// list events created by admin
routes.get('/list-admin-events', [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)], EventMiddleware.listAll);

// list events created by shop
routes.get('/list-shop-events/:userId', [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)], EventMiddleware.listShopEvents);

// create a new event
routes.post('/new/:userId([0-9]+)', [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)], EventMiddleware.newEvent);

// edit an event
routes.post('/:id([0-9]+)', EventMiddleware.editEvent);

// delete an event
routes.post('/delete/:id([0-9]+)', EventMiddleware.deleteEvent);

export default routes;

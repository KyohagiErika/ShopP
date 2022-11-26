import { Router } from "express";
import AuthMiddleware from "../middlewares/auth";
import MessageMiddleware from "../middlewares/message";

const routes = Router();

routes.get('/:chatRoomId', AuthMiddleware.checkJwt, MessageMiddleware.getMessages);

routes.post('/', AuthMiddleware.checkJwt, MessageMiddleware.addMessage);

export default routes;
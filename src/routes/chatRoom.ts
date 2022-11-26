import { Router } from "express";
import AuthMiddleware from "../middlewares/auth";
import ChatRoomMiddleware from "../middlewares/chatRoom";

const routes = Router();

routes.get('/', AuthMiddleware.checkJwt, ChatRoomMiddleware.getUserChatRoom);

routes.get('/find/:userId', AuthMiddleware.checkJwt, ChatRoomMiddleware.findChatRoom);

routes.post('/', AuthMiddleware.checkJwt, ChatRoomMiddleware.createChat);

export default routes;
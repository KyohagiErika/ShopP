import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import { RoleEnum } from "../utils/shopp.enum"
import ShopMiddleware from "../middlewares/shop";

const routes = Router();

//Get all users
routes.get("/list-all",  ShopMiddleware.listAll);//[checkJwt, checkRole(RoleEnum.ADMIN)],

// Get one user
routes.get("/:id([0-9]+)",  ShopMiddleware.getOneById);//[checkJwt, checkRole(RoleEnum.ADMIN)],

//Create a new user
routes.post("/",  ShopMiddleware.postNew);//[checkJwt, checkRole(RoleEnum.ADMIN)],

//Edit one user
routes.put("/:id([0-9]+)", [checkJwt, checkRole(RoleEnum.ADMIN)], ShopMiddleware.edit);

//Delete one user
routes.put("/delete/:id([0-9]+)",  ShopMiddleware.delete);//[checkJwt, checkRole(RoleEnum.ADMIN)],

export default routes;
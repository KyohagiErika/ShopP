import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import { RoleEnum } from "../utils/shopp.enum"
import ShopMiddleware from "../middlewares/shop";

const routes = Router();

//Get all users
routes.get("/list-all",  ShopMiddleware.listAll);//[checkJwt, checkRole(RoleEnum.ADMIN)],

// Get one user
routes.get("/:id",  ShopMiddleware.getOneById);//[checkJwt, checkRole(RoleEnum.ADMIN)],

//Create a new user
routes.post("/:userId([0-9]+)",  ShopMiddleware.postNew);//[checkJwt, checkRole(RoleEnum.ADMIN)],

//Edit one user
routes.post("/:id", ShopMiddleware.edit);//[checkJwt], checkRole(RoleEnum.ADMIN);

//Delete one user
//routes.post("/delete/:id",  ShopMiddleware.delete);//[checkJwt, checkRole(RoleEnum.ADMIN)],

export default routes;
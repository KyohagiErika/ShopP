import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import { RoleEnum } from "../utils/shopp.enum"
import UserMiddleware from "../middlewares/user";

const routes = Router(); //localhost:3000/user/123

//Get all users
routes.get("/list-all",  UserMiddleware.listAll);//[checkJwt, checkRole(RoleEnum.ADMIN)],

// Get one user
routes.get("/:id([0-9]+)", UserMiddleware.getOneById);//[checkJwt, checkRole(RoleEnum.ADMIN)],

//Create a new user
routes.post("/", UserMiddleware.postNew);//[checkJwt, checkRole(RoleEnum.ADMIN)],

//Edit one user
routes.post("/:id([0-9]+)", UserMiddleware.edit);

//Delete one user
routes.post("/delete/:id([0-9]+)", UserMiddleware.delete);//[checkJwt, checkRole(RoleEnum.ADMIN)],

export default routes;

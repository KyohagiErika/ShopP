import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import Enum from "../utils/shopp.enum"
import UserMiddleware from "../middlewares/user";

const routes = Router();

//Get all users
routes.get("/", [checkJwt, checkRole(Enum.RoleEnum.ADMIN)], UserMiddleware.listAll);

// Get one user
routes.get("/:id([0-9]+)", [checkJwt, checkRole(Enum.RoleEnum.ADMIN)], UserMiddleware.getOneById);

//Create a new user
routes.post("/", [checkJwt, checkRole(Enum.RoleEnum.ADMIN)], UserMiddleware.postNew);

//Edit one user
routes.put("/:id([0-9]+)", [checkJwt, checkRole(Enum.RoleEnum.ADMIN)], UserMiddleware.edit);

//Delete one user
routes.delete("/:id([0-9]+)", [checkJwt, checkRole(Enum.RoleEnum.ADMIN)], UserMiddleware.delete);

export default routes;

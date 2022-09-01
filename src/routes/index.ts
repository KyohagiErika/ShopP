import { Router } from "express";
import auth from "./auth";
import user from "./user";
import customer from "./customer"

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/customer",customer)

routes.use(async (req, res) => {
    res.status(404).send('Not found!');
});

export default routes;
import { Router } from "express";
import auth from "./auth";
import user from "./user";
import shop from "./shop";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/shop",shop)

routes.use(async (req, res) => {
    res.status(404).send('Not found!');
});

export default routes;
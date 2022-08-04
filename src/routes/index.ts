import { Router } from "express";

const routes = Router();
routes.get('/', (req, res, next) => {
    res.send('Hello World!');
});

export default routes;
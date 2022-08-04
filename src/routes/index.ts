import { Router } from "express";
import AccountModel from "../models/account";

const routes = Router();
routes.get('/', async (req, res) => {
    const accounts = await AccountModel.find();
    if (accounts) {
        res.send(accounts);
    } else {
        res.send('No account found!');
    }
});
routes.get('/insert', async (req, res) => {
    const data = req.query;
    if (data.username && data.password) {
        const result = await AccountModel.insert(data.username.toString(), data.password.toString());
        if (result) {
            res.send(result);
        } else {
            res.status(400).send('Insert data failed!');
        }
    } else {
        res.status(400).send('Incorrect input data!');
    }
});
routes.use(async (req, res) => {
    res.status(404).send('Not found!');
});
export default routes;
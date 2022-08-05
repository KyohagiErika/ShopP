import express from "express";
import ShopPConfig from "./utils/shopp.config";
import routes from "./routes";
import { ShopPDataSource } from "./data";
import bodyParser from "body-parser";

ShopPDataSource.initialize()
    .then(source => {
        const app = express();
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(routes);
        app.listen(ShopPConfig.PORT, () => {
            console.log(`App is listenning at port ${ShopPConfig.PORT}!`);
        });
    })
    .catch(err => {
        console.error('There are some errors while initialzing data source!');
        console.error('Detail:');
        console.log(err);
    });
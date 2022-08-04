import express from "express";
import ShopPConfig from "./utils/shopp.config";
import routes from "./routes";

const app = express();

app.use(routes);

app.listen(ShopPConfig.PORT, () => {
    console.log(`App is listening at port ${ShopPConfig.PORT}`);
});
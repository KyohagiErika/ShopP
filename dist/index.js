"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shopp_config_1 = __importDefault(require("./utils/shopp.config"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use(routes_1.default);
app.listen(shopp_config_1.default.PORT, () => {
    console.log(`App is listening at port ${shopp_config_1.default.PORT}`);
});

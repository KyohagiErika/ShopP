"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class ShopPConfig {
}
exports.default = ShopPConfig;
ShopPConfig.PORT = parseInt(process.env.PORT || '3000');

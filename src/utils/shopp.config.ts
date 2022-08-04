import { config } from "dotenv";

config();

export default class ShopPConfig {
    static PORT = parseInt(process.env.PORT || '3000');
}
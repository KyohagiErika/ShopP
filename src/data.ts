import { AdvancedConsoleLogger, DataSource } from "typeorm";
import { UserRole } from "./entities/userRole";
import { User } from "./entities/user";
import { Shop } from "./entities/shop";
import ShopPConfig from "./utils/shopp.config";

export const ShopPDataSource = new DataSource({
  type: "mysql",
  port: ShopPConfig.DATABASE_PORT,
  host: ShopPConfig.DATABASE_HOST,
  username: ShopPConfig.DATABASE_USERNAME,
  password: ShopPConfig.DATABASE_PASSWORD,
  database: ShopPConfig.DATABASE_NAME,
  entities: [UserRole, User, Shop],
    logger: new AdvancedConsoleLogger('all')
});
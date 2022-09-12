import { AdvancedConsoleLogger, DataSource } from 'typeorm';
import { UserRole } from './entities/userRole';
import { User } from './entities/user';
import { Cart } from './entities/cart';
import { Customer } from './entities/customer';
import { LocalFile } from './entities/localFile';
import ShopPConfig from './utils/shopp.config';
import { Shop } from './entities/shop';

export const ShopPDataSource = new DataSource({
  type: 'mysql',
  port: ShopPConfig.DATABASE_PORT,
  host: ShopPConfig.DATABASE_HOST,
  username: ShopPConfig.DATABASE_USERNAME,
  password: ShopPConfig.DATABASE_PASSWORD,
  database: ShopPConfig.DATABASE_NAME,
  entities: ['./entities/**/*.ts'],
  logger: new AdvancedConsoleLogger('all'),
});

import { AdvancedConsoleLogger, DataSource } from 'typeorm';
<<<<<<< HEAD
import { UserRole } from './entities/userRole';
import { UserOtp } from './entities/userOtp';
import { User } from './entities/user';
import { Cart } from './entities/cart';
import { Customer } from './entities/customer';
import { LocalFile } from './entities/localFile';
=======
>>>>>>> 3a942ed93ab0f6e4ee12c9ab0fa4813939e924cf
import ShopPConfig from './utils/shopp.config';
import * as path from 'path';

export const ShopPDataSource = new DataSource({
  type: 'mysql',
  port: ShopPConfig.DATABASE_PORT,
  host: ShopPConfig.DATABASE_HOST,
  username: ShopPConfig.DATABASE_USERNAME,
  password: ShopPConfig.DATABASE_PASSWORD,
  database: ShopPConfig.DATABASE_NAME,
<<<<<<< HEAD
  entities: [UserRole, User, Customer, Cart, LocalFile, Shop, UserOtp],
=======
  entities: [path.resolve(__dirname+'/entities/*.js')],
>>>>>>> 3a942ed93ab0f6e4ee12c9ab0fa4813939e924cf
  logger: new AdvancedConsoleLogger('all'),
});

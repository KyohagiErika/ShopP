import { AdvancedConsoleLogger, DataSource } from 'typeorm';
import ShopPConfig from './utils/shopp.config';
import * as path from 'path';

export const ShopPDataSource = new DataSource({
  type: 'mysql',
  port: ShopPConfig.DATABASE_PORT,
  host: ShopPConfig.DATABASE_HOST,
  username: ShopPConfig.DATABASE_USERNAME,
  password: ShopPConfig.DATABASE_PASSWORD,
  database: ShopPConfig.DATABASE_NAME,
  entities: [path.resolve(__dirname + '/entities/{*.js,*.ts}')],
  migrations: [path.resolve(__dirname + '/migrations/{*.js,*.ts}')],
  logger: new AdvancedConsoleLogger('all'),
});

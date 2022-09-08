import { config } from 'dotenv';

config();

export default class ShopPConfig {
  static PORT = parseInt(process.env.PORT || '3000');
  static DATABASE_PORT = parseInt(process.env.DATABASE_PORT || '3306');
  static DATABASE_HOST = process.env.DATABASE_HOST || 'localhost';
  static DATABASE_USERNAME = process.env.DATABASE_USERNAME || 'root';
  static DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';
  static DATABASE_NAME = process.env.DATABASE_NAME || 'shopp';
  static JWT_SECRET = '@QEGTUI';
}

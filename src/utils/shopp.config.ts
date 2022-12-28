import { config } from 'dotenv';

config();

export default class ShopPConfig {
  static PORT = parseInt(process.env.PORT || '3000');
  static DATABASE_PORT = parseInt(process.env.DATABASE_PORT || '3306');
  static DATABASE_HOST = process.env.DATABASE_HOST || '127.0.0.1';
  static DATABASE_USERNAME = process.env.DATABASE_USERNAME || 'root';
  static DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';
  static DATABASE_NAME = process.env.DATABASE_NAME || 'shopp';
  static ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || '@QEGTUI';
  static REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || '7y6t5r4e';
  static IMAGE_PATH = process.env.IMAGE_PATH || 'public/uploads/';
  static SMTP_USERNAME = process.env.SMTP_USERNAME;
  static SMTP_PASSWORD = process.env.SMTP_PASSWORD;
  static SMTP_SENDER = process.env.SMTP_SENDER;
  static FILE_SIZE = parseInt(process.env.FILE_SIZE || '100');
  static CLIENT_SOCKET_ENDPOINT =
    process.env.CLIENT_SOCKET_ENDPOINT || 'http://localhost:8080';
}

import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config({
  path: '.env',
});

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.model.ts'],
  migrations: ['src/database/migrations/*.ts'],
});

import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';

dotenv.config({
  path: '../.env',
});

export const DataSourceConfigPotiMain: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT_INSIDE),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  logging: true,
  synchronize: false,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/**/*-Migration.ts'],
  migrationsTableName: 'migrations',
};

export const DataSourceConfigTest: DataSourceOptions = {
  type: 'postgres',
  host: process.env.TEST_POSTGRES_HOST,
  port: Number(process.env.TEST_POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_TEST_DB,
  synchronize: true,
  entities: ['src/**/*.entity.ts'],
};
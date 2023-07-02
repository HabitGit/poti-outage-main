import 'dotenv/config';
import {DataSource} from "typeorm";

export const AppDataSource = new DataSource({
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
})
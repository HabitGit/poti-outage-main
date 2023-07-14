import 'dotenv/config';
import { DataSource } from 'typeorm';
import { DataSourceConfigPotiMain } from '../../database.config';

export const AppDataSource: DataSource = new DataSource({
  ...DataSourceConfigPotiMain,
});

//Подключение к БД
AppDataSource.initialize()
  .then(() => console.log('BD has connected'))
  .catch((error) => console.log('Error in DB: ', error));

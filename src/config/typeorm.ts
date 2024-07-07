import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Organisation, User } from '../model/user.entity';

const ENV = process.env.NODE_ENV;
const dotenv_path = path.resolve(process.cwd(), !ENV ? '.env' : `.env.${ENV}`);

dotenv.config({ path: dotenv_path });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT!,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [User, Organisation],
  migrations: [path.resolve(__dirname, '../migrations/*.ts')],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;

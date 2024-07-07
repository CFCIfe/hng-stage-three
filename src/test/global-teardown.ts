import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';

const ENV = process.env.NODE_ENV;
const dotenv_path = path.resolve(process.cwd(), !ENV ? '.env' : `.env.${ENV}`);

dotenv.config({ path: dotenv_path });

export default async () => {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'testdb',
    synchronize: true,
  });

  await dataSource.initialize();
  await dataSource.destroy();
};

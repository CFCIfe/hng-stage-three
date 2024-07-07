import { DataSource } from 'typeorm';
import { Organisation, User } from '../model/user.entity';

export default async () => {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Organisation],
    synchronize: true,
  });

  await dataSource.initialize();
};

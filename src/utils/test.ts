import { dataSource } from '../config/typeorm';
import { DataSource } from 'typeorm';

export const startTestDataSource = async () => {
    await dataSource.initialize();
}
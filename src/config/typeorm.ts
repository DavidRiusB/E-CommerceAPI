import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

import { registerAs } from '@nestjs/config';

dotenvConfig({ path: '.env.dev' });

const config = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: true, // Do not use synchronize in production
  logging: true,
  //dropSchema: true,
  cli: {
    migrationsDir: 'src/migrations',
  },
};
export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);

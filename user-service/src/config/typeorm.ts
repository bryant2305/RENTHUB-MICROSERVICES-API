import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV == 'local' ? true : false,
  logging: true,
  entities: ['./dist/**/*.entity{.ts,.js}'],
  migrations: ['./dist/database/migrations/*.{ts,js}'],
  migrationsTableName: 'migrations',
  cli: {
    migrationsDir: './dist/database/migrations/*.{ts,js}',
  },
  // seeds: [InitSeeder],
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);

import { Pool } from 'pg';

import { DATABASE_CONNECTION } from './constants';
import { DatabaseProvider } from './interfaces';

export const databaseProvider: DatabaseProvider = {
  provide: DATABASE_CONNECTION,
  useValue: new Pool({
    user: process.env.DATABASE_USERNAME,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: +process.env.DATABASE_PORT,
  }),
};

import * as dotenv from 'dotenv';

import { IDatabaseConfig } from './interfaces/db-config.interface';

dotenv.config();

// export interface DatabaseConfig {
//   host: string;
//   port: number;
//   uri: string;
// }

export const databaseConfig: IDatabaseConfig = {
  // database: {
  //   host: process.env.DB_HOST,
  //   port: parseInt(process.env.DB_PORT, 10),
  //   uri: process.env.DB_HOST,
  // },
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    // dialect: process.env.DB_DIALECT,
  },
};

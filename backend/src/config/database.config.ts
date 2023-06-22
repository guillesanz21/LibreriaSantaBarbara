import { registerAs } from '@nestjs/config';
import { getValue } from './utils';

type dbConfigType = {
  type: string;
  host: string;
  port: number;
  password: string;
  name: string;
  user: string;
  synchronize: boolean;
  maxConnections: number;
};

export default registerAs('db', () => {
  const dbConfig: dbConfigType = {
    type: getValue('DATABASE_TYPE'),
    host: getValue('DATABASE_HOST'),
    port: parseInt(getValue('DATABASE_PORT'), 10),
    password: getValue('DATABASE_PASSWORD'),
    name: getValue('DATABASE_NAME'),
    user: getValue('DATABASE_USER'),
    synchronize: getValue('DATABASE_SYNCHRONIZE') === 'true',
    maxConnections: parseInt(getValue('DATABASE_MAX_CONNECTIONS'), 10),
  };
  //   sslEnabled: process.env.DATABASE_SSL_ENABLED === 'true',
  //   rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
  //   ca: process.env.DATABASE_CA,
  //   key: process.env.DATABASE_KEY,
  //   cert: process.env.DATABASE_CERT,
  return dbConfig;
});

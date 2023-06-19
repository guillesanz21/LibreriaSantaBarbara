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
    type: getValue('DB_TYPE'),
    host: getValue('DB_HOST'),
    port: parseInt(getValue('DB_PORT'), 10),
    password: getValue('DB_PASSWORD'),
    name: getValue('DB_NAME'),
    user: getValue('DB_USER'),
    synchronize: getValue('DB_SYNCHRONIZE') === 'true',
    maxConnections: parseInt(getValue('DB_MAX_CONNECTIONS'), 10),
  };
  //   sslEnabled: process.env.DB_SSL_ENABLED === 'true',
  //   rejectUnauthorized: process.env.DB_REJECT_UNAUTHORIZED === 'true',
  //   ca: process.env.DB_CA,
  //   key: process.env.DB_KEY,
  //   cert: process.env.DB_CERT,
  return dbConfig;
});

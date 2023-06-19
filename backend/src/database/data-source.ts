import { DataSource, DataSourceOptions } from 'typeorm';

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  dropSchema: false,
  keepConnectionAlive: true,
  logging: process.env.NODE_ENV !== 'production',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src',
    migrationsDir: 'src/database/migrations',
    subscribersDir: 'subscriber',
  },
  extra: {
    // based on https://node-postgres.com/api/pool
    // max connection pool size
    max: parseInt(process.env.DB_MAX_CONNECTIONS, 10),
    // ssl:
    //   process.env.DB_SSL_ENABLED === 'true'
    //     ? {
    //         rejectUnauthorized: process.env.DB_REJECT_UNAUTHORIZED === 'true',
    //         ca: process.env.DB_CA ?? undefined,
    //         key: process.env.DB_KEY ?? undefined,
    //         cert: process.env.DB_CERT ?? undefined,
    //       }
    //     : undefined,
  },
} as DataSourceOptions);

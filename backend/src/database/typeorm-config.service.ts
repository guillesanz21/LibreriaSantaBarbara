import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get('db.type', { infer: true }),
      host: this.configService.get('db.host', { infer: true }),
      port: this.configService.get('db.port', { infer: true }),
      username: this.configService.get('db.user', { infer: true }),
      password: this.configService.get('db.password', { infer: true }),
      database: this.configService.get('db.name', { infer: true }),
      synchronize: this.configService.get('db.synchronize', {
        infer: true,
      }),
      dropSchema: false,
      keepConnectionAlive: true,
      logging:
        this.configService.get('app.env', { infer: true }) !== 'production',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        entitiesDir: 'src',
        migrationsDir: 'src/database/migrations',
        subscribersDir: 'subscriber',
      },
      extra: {
        // based on https://node-postgres.com/apis/pool
        // max connection pool size
        // max: this.configService.get('db.maxConnections', { infer: true }),
        // ssl: this.configService.get('db.sslEnabled', { infer: true })
        //   ? {
        //       rejectUnauthorized: this.configService.get(
        //         'db.rejectUnauthorized',
        //         { infer: true },
        //       ),
        //       ca: this.configService.get('db.ca', { infer: true }) ?? undefined,
        //       key:
        //         this.configService.get('db.key', { infer: true }) ?? undefined,
        //       cert:
        //         this.configService.get('db.cert', { infer: true }) ?? undefined,
        //     }
        //   : undefined,
      },
    } as TypeOrmModuleOptions;
  }
}

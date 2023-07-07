import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig, dbConfig, authConfig } from 'src/config/';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmConfigService } from '../typeorm-config.service';
import { RoleSeedModule } from './role/role-seed.module';
import { UserTypeSeedModule } from './user-type/user-type-seed.module';
import { UserSeedModule } from './user/user-seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // make config module global
      load: [authConfig, dbConfig, appConfig], // load config files
      envFilePath: `.env.${process.env.NODE_ENV}`, // load .env file
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    RoleSeedModule,
    UserTypeSeedModule,
    UserSeedModule,
  ],
})
export class SeedModule {}

import { RouterModule } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { appConfig, authConfig, CORS, dbConfig } from './config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { routes } from './routes';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // make config module global
      load: [appConfig, authConfig, CORS, dbConfig], // load config files
      envFilePath: `.env.${process.env.NODE_ENV}`, // load .env file
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    UsersModule,
    AuthModule,
    BooksModule,
    RouterModule.register(routes),
  ],
})
export class AppModule {}

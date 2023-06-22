import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { appConfig, CORS, dbConfig } from './config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // make config module global
      load: [appConfig, CORS, dbConfig], // load config files
      envFilePath: `.env.${process.env.NODE_ENV}`, // load .env file
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    UsersModule,
    BooksModule,
  ],
})
export class AppModule {}

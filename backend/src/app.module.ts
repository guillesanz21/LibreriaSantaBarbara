import { RouterModule } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { appConfig, authConfig, CORS, dbConfig, mailConfig } from './config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BooksGlobalModule } from './books/books-global.module';
import { routes } from './routes';
import { MailModule } from './mail/mail.module';
import { MailConfigService } from './mail/mail-config.service';
import { ImportExportModule } from './import-export/import-export.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // make config module global
      load: [appConfig, authConfig, CORS, dbConfig, mailConfig], // load config files
      envFilePath: `.env.${process.env.NODE_ENV}`, // load .env file
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    MailerModule.forRootAsync({
      useClass: MailConfigService,
    }),
    ImportExportModule,
    UsersModule,
    AuthModule,
    BooksGlobalModule,
    MailModule,
    RouterModule.register(routes),
  ],
})
export class AppModule {}

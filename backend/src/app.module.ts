import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, CORS } from './ config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // make config module global
      load: [appConfig, CORS], // load config files
      envFilePath: `.env.${process.env.NODE_ENV}`, // load .env file
    }),
  ],
})
export class AppModule {}

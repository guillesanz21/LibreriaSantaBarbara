import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import morgan from 'morgan';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService);

  app.use(helmet());
  app.enableCors(configService.get('CORS'));

  app.setGlobalPrefix(configService.get('app.apiPrefix'));
  app.use(morgan('dev'));

  const port = configService.get('app.port', { infer: true });

  await app.listen(port);
  console.log(`Server running on port: ${port}`);
}
bootstrap();

import { NestFactory, Reflector } from '@nestjs/core';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';
import { useContainer } from 'class-validator';
import helmet from 'helmet';
import { AppModule } from './app.module';
import validationOptions from './utils/validation-options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService);
  const nodeEnv = configService.get('app.env');

  app.use(helmet());
  app.enableCors(configService.get('CORS'));

  app.setGlobalPrefix(configService.get('app.apiPrefix'));
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  if (nodeEnv === 'development') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const morgan = require('morgan');
    app.use(morgan('dev'));
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Librería Santa Bárbara API')
    .setDescription('API documentation for Librería Santa Bárbara')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  if (nodeEnv === 'development') {
    fs.writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));
  }
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
      tagsSorter: 'alpha',
    },
  });

  const port = configService.get('app.port', { infer: true });
  await app.listen(port);
  console.log(`Server running on port: ${port}`);
}
bootstrap();

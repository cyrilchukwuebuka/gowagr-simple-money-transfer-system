import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { errorHandler } from './middleware/error';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const localhost = new RegExp('^https?://localhost*(:[0-9]+)?(/.*)?$');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appName = configService.get<string>('app.name', 'GoWagr');
  const port = configService.get<number>('app.port');
  const logger = new Logger(`${appName} Core Service`);

  const config = new DocumentBuilder()
    .setTitle('GoWagr API Documentation')
    .setDescription('A simple API documentation for the GoWagr Service')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.use(morgan('dev'));
  app.use(errorHandler);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    credentials: true,
    origin: [localhost],
    optionsSuccessStatus: 204,
  });
  await app.listen(port);
  app.use(helmet());
  app.use(helmet.xssFilter());
  logger.debug(`${appName} core service running on: ${await app.getUrl()}`);
}

bootstrap();

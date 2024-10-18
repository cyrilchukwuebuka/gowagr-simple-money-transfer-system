import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { errorHandler } from './middleware/error';
import { ConfigService } from '@nestjs/config';

const localhost = new RegExp('^https?://localhost*(:[0-9]+)?(/.*)?$');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Core Service');
  app.use(morgan('dev'));
  app.use(errorHandler);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    credentials: true,
    origin: [localhost],
    optionsSuccessStatus: 204,
  });
  const configService = app.get(ConfigService);
  const appName = configService.get<string>('app.name', 'GoWagr');
  const port = configService.get<number>('app.port', 5000);
  await app.listen(port);
  app.use(helmet());
  app.use(helmet.xssFilter());
  logger.debug(`${appName} Core service running on: ${await app.getUrl()}`);
}
bootstrap();

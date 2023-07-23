import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule);
  const config_service = app.get(ConfigService);
  // await app.listen(3000);
  // app.setGlobalPrefix('v1');
  await app.listen(config_service.get('PORT'), () =>
    logger.log(`Application running on port ${config_service.get('PORT')}`),
  );
}
bootstrap();

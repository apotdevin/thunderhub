import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.setGlobalPrefix(process.env.BASE_PATH || '');

  await app.listen(process.env.PORT || 3000, process.env.HOST);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();

import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const useHttps = process.env.USE_HTTPS === 'true';

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          ...(!useHttps && { 'upgrade-insecure-requests': null }),
        },
      },
    })
  );
  app.setGlobalPrefix(process.env.BASE_PATH || '');

  await app.listen(process.env.PORT || 3001, process.env.HOST);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

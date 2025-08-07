// src/main.ts
import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { setupAppHttp } from './setup';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  await setupAppHttp(app);
  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();

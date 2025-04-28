import { NestFactory, Reflector } from '@nestjs/core';
import { EncounterModule } from './encounter/EncounterModule';
import * as admin from 'firebase-admin';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

admin.initializeApp();

async function bootstrap() {
  const app = await NestFactory.create(EncounterModule);
  
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors({
    origin: ['*'],
    methods: ['*']
  });

  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();

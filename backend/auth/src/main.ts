import { NestFactory, Reflector } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpErrorFilter } from '../src/infrastructure/helper-error.filter';
import { TransformInterceptor } from '../src/infrastructure/transformInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
      forbidNonWhitelisted: false,
      skipMissingProperties: false,
    }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new TransformInterceptor(),
  );
  app.useGlobalFilters(new HttpErrorFilter());
  app.enableCors({
    origin: ['*'],
    methods: ['*'],
  });

  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();

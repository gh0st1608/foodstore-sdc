import { NestFactory, Reflector } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpErrorFilter } from './infrastructure/helper-error.filter';
import { TransformInterceptor } from './infrastructure/transformInterceptor';

import { createServer, proxy } from 'aws-serverless-express';
import { Handler, Context, Callback } from 'aws-lambda';

let cachedServer: any;

async function bootstrapServer() {
  const app = await NestFactory.create(AuthModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new TransformInterceptor(),
  );
  app.useGlobalFilters(new HttpErrorFilter());
  app.enableCors();

  await app.init(); // NO usar .listen()

  const expressApp = app.getHttpAdapter().getInstance();
  return createServer(expressApp);
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};

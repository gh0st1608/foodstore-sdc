import {
  INestApplication,
  INestApplicationContext,
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HttpErrorFilter } from './infrastructure/helper/helper-http-error.filter';
import { TransformInterceptor } from './infrastructure/transformInterceptor';

export async function setupApp(
  app: INestApplication | INestApplicationContext,
  mode: 'http' | 'event',
) {
  if (mode === 'http') {
    await setupHttpApp(app as INestApplication);
  } else {
    await setupEventApp(app as INestApplicationContext);
  }
}

/**
 * Configuración global para aplicaciones HTTP
 */
async function setupHttpApp(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
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
}

/**
 * Configuración global para aplicaciones event-driven
 */
async function setupEventApp(app: INestApplicationContext) {
  // Aquí podrías añadir filtros o pipes específicos para Lambdas sin HTTP
}

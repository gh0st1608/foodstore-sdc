// src/main.ts
import { NestFactory } from '@nestjs/core';
import { INestApplication, INestApplicationContext } from '@nestjs/common';
import { setupApp } from './setup';

export enum BootstrapMode {
  Http = 'http',
  Event = 'event',
}

export async function bootstrap(
  mode: BootstrapMode.Http,
  moduleRef: any,
): Promise<INestApplication>;

export async function bootstrap(
  mode: BootstrapMode.Event,
  moduleRef: any,
): Promise<INestApplicationContext>;

export async function bootstrap(
  mode: BootstrapMode,
  moduleRef: any,
): Promise<INestApplication | INestApplicationContext> {
  if (mode === BootstrapMode.Http) {
    const app = await NestFactory.create(moduleRef);
    await setupApp(app, 'http');
    return app;
  } else {
    const appContext = await NestFactory.createApplicationContext(moduleRef);
    await setupApp(appContext, 'event');
    return appContext;
  }
}


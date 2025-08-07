// src/lambda-handler.ts
import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { setupAppContext } from './setup';
import { SNSEvent } from 'aws-lambda';
import { NotificationSnsController } from './infrastructure/event.controller';

let cachedApp;

export const handler = async (event: SNSEvent) => {
  if (!cachedApp) {
    const appContext = await NestFactory.createApplicationContext(NotificationModule);
    await setupAppContext(appContext);
    cachedApp = appContext;
  }
  console.log('entro al handler')
  const controller = cachedApp.get(NotificationSnsController); // <-- importante
  await controller.handle(event);
};

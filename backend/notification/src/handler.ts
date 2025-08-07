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
  const controller = cachedApp.get(NotificationSnsController);
  await controller.handle(event);
};

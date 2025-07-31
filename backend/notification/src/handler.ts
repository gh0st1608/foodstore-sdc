import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { setupAppContext } from './setup';
import { SNSEvent } from 'aws-lambda';
import { SendWelcomeEmailUseCase } from './application/send-welcome-email.application';
import { HelperError } from './infrastructure/helper-error';

let cachedApp;

export const handler = async (event: SNSEvent) => {
  if (!cachedApp) {
    const appContext =
      await NestFactory.createApplicationContext(NotificationModule);
    await setupAppContext(appContext);
    cachedApp = appContext;
  }

  const useCase = cachedApp.get(SendWelcomeEmailUseCase);

  for (const record of event.Records) {
    try {
      const snsMessage = JSON.parse(record.Sns.Message);

      if (snsMessage.event === 'UserRegistered') {
        await useCase.execute(snsMessage.data);
      }
    } catch (error) {
      HelperError.log(error);
    }
  }
};

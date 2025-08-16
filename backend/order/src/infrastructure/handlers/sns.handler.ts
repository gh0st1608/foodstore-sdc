import { SNSEvent } from 'aws-lambda';
import { bootstrap, BootstrapMode } from '../../main';
import { OrdersModule } from '../../order.module';
import { OrderSnsController } from '../order.event.controller';
import { LambdaEventHandler } from '../types';
import { INestApplicationContext } from '@nestjs/common';

let cachedApp;

export const SnsEventHandler: LambdaEventHandler<SNSEvent> = {
  detect(event): event is SNSEvent {
    return event && Array.isArray(event.Records) && event.Records[0].EventSource === 'aws:sns';
  },

  async bootstrap(): Promise<INestApplicationContext> {
    if (!cachedApp) {
      cachedApp = await bootstrap(BootstrapMode.Event, OrdersModule);
    }
    return cachedApp;
  },

  async handle(event) {
    const appContext = await this.bootstrap();
    const controller = appContext.get(OrderSnsController);
    return controller.handle(event);
  }
};

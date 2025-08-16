import { APIGatewayProxyEvent, Context, Callback } from 'aws-lambda';
import { bootstrap, BootstrapMode } from '../../main';
import { OrdersModule } from '../../order.module';
import { createServer, proxy } from 'aws-serverless-express';
import { LambdaEventHandler } from '../types';
import { INestApplication } from '@nestjs/common';

let cachedServer;

export const HttpEventHandler: LambdaEventHandler<APIGatewayProxyEvent> = {
  detect(event): event is APIGatewayProxyEvent {
    return event && typeof event.httpMethod === 'string';
  },

  async bootstrap(): Promise<INestApplication> {
    if (!cachedServer) {
      const app: INestApplication = await bootstrap(BootstrapMode.Http, OrdersModule);
      const expressApp = app.getHttpAdapter().getInstance();
      cachedServer = createServer(expressApp);
    }
    return cachedServer;
  },

  async handle(event: APIGatewayProxyEvent, context: Context, callback: Callback) {
    const server = await this.bootstrap();
    return proxy(server, event, context, 'PROMISE').promise;
  }
};

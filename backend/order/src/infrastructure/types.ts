import { APIGatewayProxyEvent, SNSEvent, Context, Callback } from 'aws-lambda';
import { INestApplication, INestApplicationContext } from '@nestjs/common';

// Tipo genérico de Lambda Event Handler
export interface LambdaEventHandler<TEvent> {
  detect(event: any): event is TEvent;
  bootstrap(): Promise<INestApplication | INestApplicationContext>;
  handle(event: TEvent, context: Context, callback: Callback): Promise<any>;
}

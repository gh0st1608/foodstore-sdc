import { Handler, Context, Callback } from 'aws-lambda';
import { HttpEventHandler } from './infrastructure/handlers/apigateway.handler';
import { SnsEventHandler } from './infrastructure/handlers/sns.handler';

const eventHandlers = [HttpEventHandler, SnsEventHandler];

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  const handler = eventHandlers.find(h => h.detect(event));

  if (!handler) {
    throw new Error('Evento no soportado');
  }

  return handler.handle(event as never, context, callback);
};

import { Controller } from '@nestjs/common';

@Controller()
export class OrderSnsController {
  constructor(
  ) {}

  async handle(event: any) {
    for (const record of event.Records) {
      const snsMessage = JSON.parse(record.Sns.Message);

      console.log('snsMessage',snsMessage)
      const { event: eventType, data } = snsMessage;

      switch (eventType) {
        case 'OrderRegistered':
          break;

        default:
          console.warn(`Unhandled SNS event type: ${eventType}`);
      }
    }
  }
}
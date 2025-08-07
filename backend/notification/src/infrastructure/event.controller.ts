import { Controller } from '@nestjs/common';
import { UserAuthenticatedUseCase } from '../application/user-authenticated';
import { UserRegisteredUseCase} from '../application/user-registered'

// notification.sns.handler.ts
@Controller()
export class NotificationSnsController {
  constructor(
    private readonly userRegistered: UserRegisteredUseCase,
    private readonly userAuthenticated: UserAuthenticatedUseCase,
  ) {}

  async handle(event: any) {
    console.log('entro al handle del controller')
    for (const record of event.Records) {
      const snsMessage = JSON.parse(record.Sns.Message);

      console.log('snsMessage',snsMessage)
      const { event: eventType, data } = snsMessage;

      switch (eventType) {
        case 'UserRegistered':
          console.log('entro al userRegistered')
          await this.userRegistered.execute(data);
          break;

        case 'UserAuthenticated':
          console.log('entro al userAuthenticated')
          await this.userAuthenticated.execute(data);
          break;

        default:
          console.warn(`Unhandled SNS event type: ${eventType}`);
      }
    }
  }
}

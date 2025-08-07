import { Controller } from '@nestjs/common';
import { UserAuthenticatedUseCase } from '../application/user-authenticated';
import { UserRegisteredUseCase} from '../application/user-registered'

@Controller()
export class NotificationSnsController {
  constructor(
    private readonly userRegistered: UserRegisteredUseCase,
    private readonly userAuthenticated: UserAuthenticatedUseCase,
  ) {}

  async handle(event: any) {
    for (const record of event.Records) {
      const snsMessage = JSON.parse(record.Sns.Message);

      console.log('snsMessage',snsMessage)
      const { event: eventType, data } = snsMessage;

      switch (eventType) {
        case 'UserRegistered':
          await this.userRegistered.execute(data);
          break;

        case 'UserAuthenticated':
          await this.userAuthenticated.execute(data);
          break;

        default:
          console.warn(`Unhandled SNS event type: ${eventType}`);
      }
    }
  }
}

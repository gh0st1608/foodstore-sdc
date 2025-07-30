import { Mailer } from '../domain/interfaces/mailer.interface';
import { MailerService} from '../domain/service/mailer.service';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

export class SesMailerImpl implements MailerService {
  private ses = new SESClient({ region: process.env.REGION });

  async sendEmail(mailer : Mailer): Promise<void> {
    const command = new SendEmailCommand({
      Source: process.env.MAIL_FROM,
      Destination: { ToAddresses: [mailer.to] },
      Message: {
        Subject: { Data: mailer.subject },
        Body: {
          Text: { Data: mailer.body },
        },
      },
    });

    await this.ses.send(command);
  }
}

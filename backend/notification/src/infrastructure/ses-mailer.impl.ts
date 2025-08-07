import { Mailer } from '../domain/interfaces/mailer.interface';
import { SesMailerService} from '../domain/service/mailer.service';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

export class SesMailerImpl implements SesMailerService {
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
    console.log('entro al sendmail de ses')
    await this.ses.send(command);
  }
}

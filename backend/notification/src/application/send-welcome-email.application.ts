import { Inject, Injectable } from '@nestjs/common';
import {
  MailerService,
  MailerServiceSymbol,
} from '../domain/service/mailer.service';

@Injectable()
export class SendWelcomeEmailUseCase {
  constructor(
    @Inject(MailerServiceSymbol)
    private readonly mailerService: MailerService,
  ) {}

  async execute(user: { email: string; userId: string }): Promise<void> {
    const subject = '¡Bienvenido!';
    const body = `Hola ${user.email}, gracias por registrarte. Tu ID es ${user.userId}.`;

    await this.mailerService.sendEmail({ to: user.email, subject, body });
  }
}

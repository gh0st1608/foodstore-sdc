import { Inject, Injectable } from '@nestjs/common';
import {
  SesMailerService,
  SesMailerServiceSymbol,
} from '../domain/service/mailer.service';

@Injectable()
export class UserAuthenticatedUseCase {
  constructor(
    @Inject(SesMailerServiceSymbol)
    private readonly mailerService: SesMailerService,
  ) {}

  async execute(user: { email: string; userId: string }): Promise<void> {
    const subject = '¡Bienvenido!';
    const body = `Hola ${user.email}, gracias por autenticarte`;

    await this.mailerService.sendEmail({ to: user.email, subject, body });
  }
}

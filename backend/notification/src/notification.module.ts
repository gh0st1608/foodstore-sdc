// infrastructure/notification.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SendWelcomeEmailUseCase } from './application/send-welcome-email.application';
import { MailerServiceSymbol } from './domain/service/mailer.service';
import { SesMailerImpl } from './infrastructure/ses-mailer';

@Module({
    imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV || ''}.env`,
      isGlobal: true,
    }),
  ],
  providers: [
    SendWelcomeEmailUseCase,
    {
      provide: MailerServiceSymbol,
      useClass: SesMailerImpl,
    },
  ],
  exports: [SendWelcomeEmailUseCase],
})
export class NotificationModule {}

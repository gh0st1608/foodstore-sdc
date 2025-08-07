// infrastructure/notification.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserRegisteredUseCase } from './application/user-registered';
import { UserAuthenticatedUseCase } from './application/user-authenticated';
import { SesMailerServiceSymbol } from './domain/service/mailer.service';
import { SesMailerImpl } from './infrastructure/ses-mailer.impl';
import { NotificationSnsController } from './infrastructure/event.controller';

@Module({
    imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV || ''}.env`,
      isGlobal: true,
    }),
  ],
  controllers: [NotificationSnsController],
  providers: [
    UserRegisteredUseCase,
    UserAuthenticatedUseCase,
    {
      provide: SesMailerServiceSymbol,
      useClass: SesMailerImpl,
    },
  ],
})
export class NotificationModule {}

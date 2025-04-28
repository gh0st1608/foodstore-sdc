import { Module } from '@nestjs/common';
/* import { APP_FILTER } from '@nestjs/core'; */
import { EncounterController } from './infrastructure/controller/EncounterController';
import { EncounterApplication } from './application/EncounterApplication';
import { LoggingServiceSymbol } from '../common/domain/services/LoggingService';
import { EncounterCreateRepositorySymbol } from './domain/repository/EncounterCreateRepository';
import { EncounterCreateRepositoryImp } from './infrastructure/repository/EncounterCreateRepositoryImp';
import { ConsoleLoggingServiceImp } from '../common/infrastructure/services/ConsoleLoggingServiceImp';
import { ConfigModule } from '@nestjs/config';
import { EncounterDeleteRepositorySymbol } from './domain/repository/EncounterDeleteRepository';
import { EncounterDeleteRepositoryImp } from './infrastructure/repository/EncounterDeleteRepositoryImp';
import { EncounterUpdateRepositorySymbol } from './domain/repository/EncounterUpdateRepository';
import { EncounterUpdateRepositoryImp } from './infrastructure/repository/EncounterUpdateRepositoryImp';
import { EncounterGetRepositorySymbol } from './domain/repository/EncounterGetRepository';
import { EncounterGetRepositoryImp } from './infrastructure/repository/EncounterGetRepositoryImp';
import { TelemedicineEncounterUpdateRepositorySymbol } from './domain/repository/TelemedicineEncounterUpdateRepository';
import { TelemedicineEncounterUpdateRepositoryImp } from './infrastructure/repository/TelemedicineEncounterUpdateRepositoryImp';
import { TelemedicineEncounterCreateRepositoryImp } from './infrastructure/repository/TelemedicineEncounterCreateRepositoryImp';
import { TelemedicineEncounterCreateRepositorySymbol } from './domain/repository/TelemedicineEncounterCreateRepository';
import { TelemedicineEncounterGetRepositorySymbol } from './domain/repository/TelemedicineEncounterGetRepository';
import { TelemedicineEncounterGetRepositoryImp } from './infrastructure/repository/TelemedicineEncounterGetRepositoryImp';
import { TelemedicineEncounterDeleteRepositorySymbol } from './domain/repository/TelemedicineEncounterDeleteRepository';
import { TelemedicineEncounterDeleteRepositoryImp } from './infrastructure/repository/TelemedicineEncounterDeleteRepositoryImp';
import { TelemedicineEncounterApplication } from './application/EncounterTelemedicineApplication';
import { HttpErrorFilter } from '../common/infrastructure/errors/HttpErrorFilter';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV || ''}.env`,
      isGlobal: true,
    }),
  ],
  controllers: [EncounterController],
  providers: [
    /* {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    }, */
    {
      provide: EncounterCreateRepositorySymbol,
      useClass: EncounterCreateRepositoryImp
    },
    {
      provide: EncounterGetRepositorySymbol,
      useClass: EncounterGetRepositoryImp
    },
    {
      provide: EncounterDeleteRepositorySymbol,
      useClass: EncounterDeleteRepositoryImp
    },
    {
      provide: TelemedicineEncounterUpdateRepositorySymbol,
      useClass: TelemedicineEncounterUpdateRepositoryImp
    },
    {
      provide: TelemedicineEncounterCreateRepositorySymbol,
      useClass: TelemedicineEncounterCreateRepositoryImp
    },
    {
      provide: TelemedicineEncounterGetRepositorySymbol,
      useClass: TelemedicineEncounterGetRepositoryImp
    },
    {
      provide: TelemedicineEncounterDeleteRepositorySymbol,
      useClass: TelemedicineEncounterDeleteRepositoryImp
    },
    {
      provide: EncounterUpdateRepositorySymbol,
      useClass: EncounterUpdateRepositoryImp
    },
    {
      provide: LoggingServiceSymbol,
      useClass: ConsoleLoggingServiceImp
    },
    EncounterApplication,
    TelemedicineEncounterApplication
  ]
})
export class EncounterModule {}

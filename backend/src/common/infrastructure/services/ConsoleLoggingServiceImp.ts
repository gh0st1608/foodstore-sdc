/* eslint-disable no-console */
import { LoggingService } from '../../domain/services/LoggingService';
import { LoggingEvent } from '../../domain/entities/LoggingEvent';

export class ConsoleLoggingServiceImp implements LoggingService {
  async logErrorEvent(event: LoggingEvent): Promise<void> {
    console.error(JSON.stringify(event.toPrimitives()));
  }

  async logInfoEvent(event: LoggingEvent): Promise<void> {
    console.info(JSON.stringify(event.toPrimitives()));
  }

  async logWarningEvent(event: LoggingEvent): Promise<void> {
    console.warn(JSON.stringify(event.toPrimitives()));
  }

  async logDebugEvent(event: LoggingEvent): Promise<void> {
    console.debug(JSON.stringify(event.toPrimitives()));
  }

  async logAuditEvent(event: LoggingEvent): Promise<void> {
    console.log(JSON.stringify(event.toPrimitives()));
  }

  async logPerformanceEvent(event: LoggingEvent): Promise<void> {
    console.log(JSON.stringify(event.toPrimitives()));
  }

  async logSecurityEvent(event: LoggingEvent): Promise<void> {
    console.log(JSON.stringify(event.toPrimitives()));
  }
}

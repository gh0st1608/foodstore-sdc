import { LoggingEvent } from '../entities/LoggingEvent';

export interface LoggingService {
  logErrorEvent(event: LoggingEvent): Promise<void>;
  logInfoEvent(event: LoggingEvent): Promise<void>;
  logWarningEvent(event: LoggingEvent): Promise<void>;
  logDebugEvent(event: LoggingEvent): Promise<void>;
  logAuditEvent(event: LoggingEvent): Promise<void>;
  logPerformanceEvent(event: LoggingEvent): Promise<void>;
  logSecurityEvent(event: LoggingEvent): Promise<void>;
}

export const LoggingServiceSymbol = Symbol('LoggingService');

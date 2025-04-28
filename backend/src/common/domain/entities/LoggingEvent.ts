import { DataLoggingEvent } from '../properties/logging/DataLoggingEvent';
import { NameLoggingEvent } from '../properties/logging/NameLoggingEvent';

export class LoggingEvent {
  private constructor(
    readonly name: NameLoggingEvent,
    /* readonly labels: JsonStructure, */
    readonly data: DataLoggingEvent
  ) {}

  public static create(data: LoggingEvent) {
    return new LoggingEvent(
      data.name,
      /* new JsonStructure(data.labels), */
      data.data
    );
  }

  public toPrimitives(): LoggingEvent {
    return {
      name: this.name,
      /* labels: this.labels, */
      data: this.data
    };
  }
}

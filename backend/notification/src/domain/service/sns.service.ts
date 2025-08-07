import { Event } from '../interfaces/event.interface';

export interface EventSnsService {
  dispatcherUser(event: Event): Promise<void>;
}

export const EventSnsServiceSymbol = Symbol('EventSnsService');
import { DomainEvent } from '../domain-event';

export type EventConstructor<T extends DomainEvent> = new (...args: any[]) => T;

export interface EventHandler<T extends DomainEvent = DomainEvent> {
  appliesTo(): EventConstructor<T>;

  handle(event: T): void;
}

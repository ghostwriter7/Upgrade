import { DomainEvent } from '@common/routers/event/domain-event';
import { Constructor } from '@common/types/constructor.type';

export interface EventHandler<T extends DomainEvent = DomainEvent> {
  appliesTo(): Constructor<T>;

  handle(event: T): void;
}

import { inject, Injectable } from '@angular/core';
import { EVENT_HANDLERS } from '@common/routers/event/event-handlers.token';
import { EventHandler } from '@common/routers/event/event-handler.interface';
import { DomainEvent } from '@common/routers/event/domain-event';
import { Constructor } from '@common/types/constructor.type';

@Injectable({ providedIn: 'root' })
export class EventBus {
  private readonly handlers: EventHandler[] = inject(EVENT_HANDLERS);
  private readonly lookup = this.handlers.reduce((lookup, handler) => {
    const token = handler.appliesTo();
    const existingHandlers = lookup.get(token);

    if (existingHandlers) {
      lookup.set(token, [...existingHandlers, handler]);
    } else {
      lookup.set(token, [handler]);
    }

    return lookup;
  }, new Map<Constructor<DomainEvent>, EventHandler[]>());

  public publish(event: DomainEvent): void {
    const handlers = this.lookup.get(event.constructor as Constructor<DomainEvent>);

    if (!handlers) {
      throw new Error(`No handler found for event: ${event.constructor.name}`);
    }

    for (const handler of handlers) {
      handler.handle(event);
    }
  }
}

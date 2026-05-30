import { inject, Injectable } from '@angular/core';
import { EVENT_HANDLERS } from '../events/event-handlers.token';
import { EventConstructor, EventHandler } from '../events/event-handler.interface';
import { DomainEvent } from '../events/domain-event';

@Injectable({ providedIn: 'root' })
export class EventBus {

  private readonly handlers: EventHandler[] = inject(EVENT_HANDLERS);
  private readonly lookup = this.handlers.reduce((lookup, handler) => {
    lookup.set(handler.appliesTo(), handler);
    return lookup;
  }, new Map<EventConstructor<DomainEvent>, EventHandler>());

  public dispatch(event: DomainEvent): void {
    const handler = this.lookup.get(event.constructor as EventConstructor<DomainEvent>);

    if (!handler) {
      throw new Error(`No handler found for event: ${event.constructor.name}`);
    }

    handler.handle(event);
  }
}

import { inject, Injectable } from '@angular/core';
import { EVENT_HANDLERS } from '@session/events/event-handlers.token';
import { EventHandler } from '@session/events/event-handler.interface';
import { DomainEvent } from '@session/events/domain-event';
import { Constructor } from '@common/types/constructor.type';

@Injectable({ providedIn: 'root' })
export class EventBus {

  private readonly handlers: EventHandler[] = inject(EVENT_HANDLERS);
  private readonly lookup = this.handlers.reduce((lookup, handler) => {
    lookup.set(handler.appliesTo(), handler);
    return lookup;
  }, new Map<Constructor<DomainEvent>, EventHandler>());

  public dispatch(event: DomainEvent): void {
    const handler = this.lookup.get(event.constructor as Constructor<DomainEvent>);

    if (!handler) {
      throw new Error(`No handler found for event: ${event.constructor.name}`);
    }

    handler.handle(event);
  }
}

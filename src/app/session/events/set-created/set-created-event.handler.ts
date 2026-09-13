import { EventHandler } from '@common/routers/event/event-handler.interface';
import { inject, Injectable } from '@angular/core';
import { SetCreatedEvent } from './set-created.event';
import { SetRepository } from '@persistence/repository/set.repository';
import { Constructor } from '@common/types/constructor.type';

@Injectable()
export class SetCreatedEventHandler implements EventHandler<SetCreatedEvent> {
  private readonly setRepository = inject(SetRepository);

  public appliesTo(): Constructor<SetCreatedEvent> {
    return SetCreatedEvent;
  }

  public handle(event: SetCreatedEvent): void {
    this.setRepository.createSet(event.set);
  }
}

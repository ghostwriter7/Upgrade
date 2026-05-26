import { inject, Injectable } from '@angular/core';
import { EventConstructor, EventHandler } from '../event-handler.interface';
import { SetUpdatedEvent } from '../../set-updated.event';
import { SetRepository } from '../../../../persistence/repository/set.repository';

@Injectable()
export class SetUpdatedEventHandler implements EventHandler<SetUpdatedEvent> {
  private readonly setRepository = inject(SetRepository);

  public appliesTo(): EventConstructor<SetUpdatedEvent> {
    return SetUpdatedEvent;
  }

  public handle(event: SetUpdatedEvent): void {
    this.setRepository.upsertSet(event.set);
  }
}

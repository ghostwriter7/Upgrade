import { EventConstructor, EventHandler } from '../event-handler.interface';
import { inject, Injectable } from '@angular/core';
import { SetCreatedEvent } from '../../set-created.event';
import { SetRepository } from '../../../../persistence/repository/set.repository';

@Injectable()
export class SetCreatedEventHandler implements EventHandler<SetCreatedEvent> {
  private readonly setRepository = inject(SetRepository);

  public appliesTo(): EventConstructor<SetCreatedEvent> {
    return SetCreatedEvent;
  }

  public handle(event: SetCreatedEvent): void {
    this.setRepository.upsertSet(event.set);
  }

}

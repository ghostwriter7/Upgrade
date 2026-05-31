import { inject, Injectable } from '@angular/core';
import { EventHandler } from '../event-handler.interface';
import { SetUpdatedEvent } from './set-updated.event';
import { SetRepository } from '../../../persistence/repository/set.repository';
import { Constructor } from '@common/types/constructor.type';

@Injectable()
export class SetUpdatedEventHandler implements EventHandler<SetUpdatedEvent> {
  private readonly setRepository = inject(SetRepository);

  public appliesTo(): Constructor<SetUpdatedEvent> {
    return SetUpdatedEvent;
  }

  public handle(event: SetUpdatedEvent): void {
    this.setRepository.upsertSet(event.set);
  }
}

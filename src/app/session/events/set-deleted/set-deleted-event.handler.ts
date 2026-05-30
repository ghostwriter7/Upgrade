import { inject, Injectable } from '@angular/core';
import { EventConstructor, EventHandler } from '../event-handler.interface';
import { SetDeletedEvent } from './set-deleted.event';
import { SetRepository } from '../../../persistence/repository/set.repository';

@Injectable()
export class SetDeletedEventHandler implements EventHandler<SetDeletedEvent> {
  private readonly setRepository = inject(SetRepository);

  public appliesTo(): EventConstructor<SetDeletedEvent> {
    return SetDeletedEvent;
  }

  public handle(event: SetDeletedEvent): void {
    this.setRepository.deleteSet(event.setId);
  }
}

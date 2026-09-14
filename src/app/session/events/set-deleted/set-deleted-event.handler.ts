import { inject, Injectable } from '@angular/core';
import { EventHandler } from '@common/routers/event/event-handler.interface';
import { SetDeletedEvent } from './set-deleted.event';
import { SetRepository } from '../../../persistence/repository/set.repository';
import { Constructor } from '@common/types/constructor.type';

@Injectable()
export class SetDeletedEventHandler implements EventHandler<SetDeletedEvent> {
  private readonly setRepository = inject(SetRepository);

  public appliesTo(): Constructor<SetDeletedEvent> {
    return SetDeletedEvent;
  }

  public handle(event: SetDeletedEvent): void {
    this.setRepository.deleteById(event.setId);
  }
}

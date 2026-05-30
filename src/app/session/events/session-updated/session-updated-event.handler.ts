import { inject, Injectable } from '@angular/core';
import { EventConstructor, EventHandler } from '../event-handler.interface';
import { SessionUpdatedEvent } from './session-updated.event';
import { SessionRepository } from '../../../persistence/repository/session.repository';

@Injectable()
export class SessionUpdatedEventHandler implements EventHandler<SessionUpdatedEvent> {
  private readonly sessionRepository = inject(SessionRepository);

  public appliesTo(): EventConstructor<SessionUpdatedEvent> {
    return SessionUpdatedEvent;
  }

  public handle(event: SessionUpdatedEvent): void {
    this.sessionRepository.save(event.session);
  }
}

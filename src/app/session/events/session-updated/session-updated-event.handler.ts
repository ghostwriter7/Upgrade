import { inject, Injectable } from '@angular/core';
import { EventHandler } from '@common/routers/event/event-handler.interface';
import { SessionUpdatedEvent } from './session-updated.event';
import { SessionRepository } from '../../../persistence/repository/session.repository';
import { Constructor } from '@common/types/constructor.type';

@Injectable()
export class SessionUpdatedEventHandler implements EventHandler<SessionUpdatedEvent> {
  private readonly sessionRepository = inject(SessionRepository);

  public appliesTo(): Constructor<SessionUpdatedEvent> {
    return SessionUpdatedEvent;
  }

  public handle(event: SessionUpdatedEvent): void {
    this.sessionRepository.save(event.session);
  }
}

import { inject, Injectable } from '@angular/core';
import { EventHandler } from '@common/routers/event/event-handler.interface';
import { SessionDeletedEvent } from './session-deleted.event';
import { SessionRepository } from '@persistence/repository/session.repository';
import { Router } from '@angular/router';
import { Constructor } from '@common/types/constructor.type';

@Injectable()
export class SessionDeletedEventHandler implements EventHandler<SessionDeletedEvent> {
  private readonly sessionRepository = inject(SessionRepository);
  private readonly router = inject(Router);

  public appliesTo(): Constructor<SessionDeletedEvent> {
    return SessionDeletedEvent;
  }

  public handle({ sessionId }: SessionDeletedEvent): void {
    this.sessionRepository.deleteById(sessionId);

    const route = this.router.routerState.snapshot.url;
    if (route.includes('edit') || route.includes('new')) {
      this.router.navigateByUrl('/');
    }
  }
}

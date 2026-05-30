import { inject, Injectable } from '@angular/core';
import { EventConstructor, EventHandler } from '../event-handler.interface';
import { SessionDeletedEvent } from './session-deleted.event';
import { SessionRepository } from '../../../persistence/repository/session.repository';
import { ExerciseLogRepository } from '../../../persistence/repository/exercise-log.repository';
import { MediaRepository } from '../../../persistence/repository/media.repository';
import { SetRepository } from '../../../persistence/repository/set.repository';
import { Router } from '@angular/router';

@Injectable()
export class SessionDeletedEventHandler implements EventHandler<SessionDeletedEvent> {
  private readonly sessionRepository = inject(SessionRepository);
  private readonly setRepository = inject(SetRepository);
  private readonly exerciseLogRepository = inject(ExerciseLogRepository);
  private readonly mediaRepository = inject(MediaRepository);
  private readonly router = inject(Router);

  public appliesTo(): EventConstructor<SessionDeletedEvent> {
    return SessionDeletedEvent;
  }

  public handle({sessionId}: SessionDeletedEvent): void {
    this.sessionRepository.deleteById(sessionId);
    this.setRepository.deleteAllBySessionId(sessionId);
    this.exerciseLogRepository.deleteAllBySessionId(sessionId);
    this.mediaRepository.deleteAllBySessionId(sessionId);

    const route = this.router.routerState.snapshot.url;
    if (route.includes('edit') || route.includes('new')) {
      this.router.navigateByUrl('/');
    }
  }
}

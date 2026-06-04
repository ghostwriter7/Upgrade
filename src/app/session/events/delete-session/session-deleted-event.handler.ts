import { inject, Injectable } from '@angular/core';
import { EventHandler } from '@common/routers/event/event-handler.interface';
import { SessionDeletedEvent } from './session-deleted.event';
import { SessionRepository } from '@persistence/repository/session.repository';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';
import { MediaRepository } from '@persistence/repository/media.repository';
import { SetRepository } from '@persistence/repository/set.repository';
import { Router } from '@angular/router';
import { Constructor } from '@common/types/constructor.type';
import { AngleMeasurementRepository } from '@persistence/repository/angle-measurement/angle-measurement.repository';

@Injectable()
export class SessionDeletedEventHandler implements EventHandler<SessionDeletedEvent> {
  private readonly sessionRepository = inject(SessionRepository);
  private readonly setRepository = inject(SetRepository);
  private readonly exerciseLogRepository = inject(ExerciseLogRepository);
  private readonly mediaRepository = inject(MediaRepository);
  private readonly angleMeasurementRepository = inject(AngleMeasurementRepository);
  private readonly router = inject(Router);

  public appliesTo(): Constructor<SessionDeletedEvent> {
    return SessionDeletedEvent;
  }

  public handle({ sessionId, exerciseLogIds }: SessionDeletedEvent): void {
    this.sessionRepository.deleteById(sessionId);
    this.setRepository.deleteAllBySessionId(sessionId);
    this.exerciseLogRepository.deleteAllBySessionId(sessionId);

    exerciseLogIds.forEach((exerciseLogId) => {
      this.mediaRepository.deleteAllByExerciseLogId(exerciseLogId);
      this.angleMeasurementRepository.deleteAllByExerciseLogId(exerciseLogId);
    });

    const route = this.router.routerState.snapshot.url;
    if (route.includes('edit') || route.includes('new')) {
      this.router.navigateByUrl('/');
    }
  }
}

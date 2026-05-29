import { inject, Injectable } from '@angular/core';
import { EventConstructor, EventHandler } from '../event-handler.interface';
import { ExerciseLogDeletedEvent } from '../../exercise-log-deleted.event';
import { ExerciseLogRepository } from '../../../../persistence/repository/exercise-log.repository';
import { SetRepository } from '../../../../persistence/repository/set.repository';

@Injectable()
export class ExerciseLogDeletedEventHandler implements EventHandler<ExerciseLogDeletedEvent> {
  private readonly exerciseLogRepository = inject(ExerciseLogRepository);
  private readonly setRepository = inject(SetRepository);

  public appliesTo(): EventConstructor<ExerciseLogDeletedEvent> {
    return ExerciseLogDeletedEvent;
  }

  public handle(event: ExerciseLogDeletedEvent): void {
    this.exerciseLogRepository.deleteLog(event.exerciseLog.id);
    this.setRepository.deleteBySessionAndExercise(event.exerciseLog.sessionId, event.exerciseLog.exerciseId);
  }
}

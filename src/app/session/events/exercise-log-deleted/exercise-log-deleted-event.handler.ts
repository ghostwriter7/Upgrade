import { inject, Injectable } from '@angular/core';
import { EventHandler } from '@common/routers/event/event-handler.interface';
import { ExerciseLogDeletedEvent } from './exercise-log-deleted.event';
import { ExerciseLogRepository } from '../../../persistence/repository/exercise-log.repository';
import { SetRepository } from '../../../persistence/repository/set.repository';
import { Constructor } from '@common/types/constructor.type';

@Injectable()
export class ExerciseLogDeletedEventHandler implements EventHandler<ExerciseLogDeletedEvent> {
  private readonly exerciseLogRepository = inject(ExerciseLogRepository);
  private readonly setRepository = inject(SetRepository);

  public appliesTo(): Constructor<ExerciseLogDeletedEvent> {
    return ExerciseLogDeletedEvent;
  }

  public handle(event: ExerciseLogDeletedEvent): void {
    this.exerciseLogRepository.deleteLog(event.exerciseLog.id);
    this.setRepository.deleteBySessionAndExercise(event.exerciseLog.sessionId, event.exerciseLog.exerciseId);
  }
}

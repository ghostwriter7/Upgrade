import { inject, Injectable } from '@angular/core';
import { EventHandler } from '@common/routers/event/event-handler.interface';
import { ExerciseLogDeletedEvent } from './exercise-log-deleted.event';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';
import { Constructor } from '@common/types/constructor.type';

@Injectable()
export class ExerciseLogDeletedEventHandler implements EventHandler<ExerciseLogDeletedEvent> {
  private readonly exerciseLogRepository = inject(ExerciseLogRepository);

  public appliesTo(): Constructor<ExerciseLogDeletedEvent> {
    return ExerciseLogDeletedEvent;
  }

  public handle({ exerciseLog }: ExerciseLogDeletedEvent): void {
    this.exerciseLogRepository.deleteLog(exerciseLog.id);
  }
}

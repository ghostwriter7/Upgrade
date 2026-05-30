import { inject, Injectable } from '@angular/core';
import { EventConstructor, EventHandler } from '../event-handler.interface';
import { ExerciseLogUpdatedEvent } from './exercise-log-updated.event';
import { ExerciseLogRepository } from '../../../persistence/repository/exercise-log.repository';

@Injectable()
export class ExerciseLogUpdatedEventHandler implements EventHandler<ExerciseLogUpdatedEvent> {
  private readonly exerciseLogRepository = inject(ExerciseLogRepository);

  public appliesTo(): EventConstructor<ExerciseLogUpdatedEvent> {
    return ExerciseLogUpdatedEvent;
  }

  public handle(event: ExerciseLogUpdatedEvent): void {
    this.exerciseLogRepository.saveLog(event.exerciseLog);
  }

}

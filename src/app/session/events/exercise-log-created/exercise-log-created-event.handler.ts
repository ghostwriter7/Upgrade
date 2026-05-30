import { inject, Injectable } from '@angular/core';
import { EventConstructor, EventHandler } from '../event-handler.interface';
import { ExerciseLogCreatedEvent } from './exercise-log-created.event';
import { ExerciseLogRepository } from '../../../persistence/repository/exercise-log.repository';

@Injectable()
export class ExerciseLogCreatedEventHandler implements EventHandler<ExerciseLogCreatedEvent> {
  private readonly exerciseLogRepository = inject(ExerciseLogRepository);

  public appliesTo(): EventConstructor<ExerciseLogCreatedEvent> {
    return ExerciseLogCreatedEvent;
  }

  public handle(event: ExerciseLogCreatedEvent): void {
    this.exerciseLogRepository.saveLog(event.exerciseLog);
  }

}

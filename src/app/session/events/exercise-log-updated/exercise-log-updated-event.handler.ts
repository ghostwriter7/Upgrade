import { inject, Injectable } from '@angular/core';
import { EventHandler } from '../event-handler.interface';
import { ExerciseLogUpdatedEvent } from './exercise-log-updated.event';
import { ExerciseLogRepository } from '../../../persistence/repository/exercise-log.repository';
import { Constructor } from '@common/types/constructor.type';

@Injectable()
export class ExerciseLogUpdatedEventHandler implements EventHandler<ExerciseLogUpdatedEvent> {
  private readonly exerciseLogRepository = inject(ExerciseLogRepository);

  public appliesTo(): Constructor<ExerciseLogUpdatedEvent> {
    return ExerciseLogUpdatedEvent;
  }

  public handle(event: ExerciseLogUpdatedEvent): void {
    this.exerciseLogRepository.saveLog(event.exerciseLog);
  }

}

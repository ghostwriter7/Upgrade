import { inject, Injectable } from '@angular/core';
import { EventHandler } from '../event-handler.interface';
import { ExerciseLogCreatedEvent } from './exercise-log-created.event';
import { ExerciseLogRepository } from '../../../persistence/repository/exercise-log.repository';
import { Constructor } from '@common/types/constructor.type';

@Injectable()
export class ExerciseLogCreatedEventHandler implements EventHandler<ExerciseLogCreatedEvent> {
  private readonly exerciseLogRepository = inject(ExerciseLogRepository);

  public appliesTo(): Constructor<ExerciseLogCreatedEvent> {
    return ExerciseLogCreatedEvent;
  }

  public handle(event: ExerciseLogCreatedEvent): void {
    this.exerciseLogRepository.saveLog(event.exerciseLog);
  }

}

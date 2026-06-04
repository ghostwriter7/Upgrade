import { inject, Injectable } from '@angular/core';
import { EventHandler } from '@common/routers/event/event-handler.interface';
import { ExerciseLogDeletedEvent } from './exercise-log-deleted.event';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';
import { SetRepository } from '@persistence/repository/set.repository';
import { Constructor } from '@common/types/constructor.type';
import { AngleMeasurementRepository } from '@persistence/repository/angle-measurement/angle-measurement.repository';
import { MediaRepository } from '@persistence/repository/media.repository';

@Injectable()
export class ExerciseLogDeletedEventHandler implements EventHandler<ExerciseLogDeletedEvent> {
  private readonly exerciseLogRepository = inject(ExerciseLogRepository);
  private readonly setRepository = inject(SetRepository);
  private readonly mediaRepository = inject(MediaRepository);
  private readonly angleMeasurementRepository = inject(AngleMeasurementRepository);

  public appliesTo(): Constructor<ExerciseLogDeletedEvent> {
    return ExerciseLogDeletedEvent;
  }

  public handle({ exerciseLog }: ExerciseLogDeletedEvent): void {
    this.exerciseLogRepository.deleteLog(exerciseLog.id);
    this.setRepository.deleteBySessionAndExercise(exerciseLog.sessionId, exerciseLog.exerciseId);

    this.mediaRepository.deleteAllByExerciseLogId(exerciseLog.id);
    this.angleMeasurementRepository.deleteAllByExerciseLogId(exerciseLog.id);
  }
}

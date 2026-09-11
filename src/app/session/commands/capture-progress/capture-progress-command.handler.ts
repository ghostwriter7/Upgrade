import { inject, Injectable } from '@angular/core';
import { CommandHandler } from '@common/routers/command/command-handler.interface';
import { CaptureProgressCommand } from './capture-progress.command';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { EventBus } from '@common/routers/event/event-bus';
import { ExerciseMedia } from '@domain/model/exercise-media.model';
import { MediaCapturedEvent } from '../../events/media-captured/media-captured.event';
import { Constructor } from '@common/types/constructor.type';
import { AngleMeasurement, Landmark } from '@domain/model/measurement.model';
import { ExerciseStore } from '@store/exercises.store';
import { AngleMeasurementCapturedEvent } from '@session/events/angle-measurement-captured/angle-measurement-captured.event';
import { AngleMeasurementDefinition } from '@domain/interface/angle-measurement-definition.interface';

@Injectable()
export class CaptureProgressCommandHandler implements CommandHandler<CaptureProgressCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly eventBus = inject(EventBus);
  private readonly exerciseStore = inject(ExerciseStore);

  public appliesTo(): Constructor<CaptureProgressCommand> {
    return CaptureProgressCommand;
  }

  public handle({ image, width, height, exerciseId, points, angle }: CaptureProgressCommand): void {
    const exerciseLogId = this.findExerciseLogId(exerciseId);

    const media = ExerciseMedia.newImage(exerciseId, exerciseLogId, width, height);
    this.eventBus.publish(new MediaCapturedEvent(media, image));

    if (points && angle) {
      const measurementDefinition = this.findMeasurementDefinition(exerciseId);

      if (measurementDefinition && points.length !== measurementDefinition.landmarks.length)
        throw new Error('Invalid number of points provided');

      const angleMeasurement = AngleMeasurement.new(
        media.id,
        exerciseId,
        exerciseLogId,
        angle,
        measurementDefinition
          ? measurementDefinition.landmarks.map(
              (landmark, index) => new Landmark(points[index], landmark),
            )
          : points.map((point) => new Landmark(point)),
      );

      this.eventBus.publish(new AngleMeasurementCapturedEvent(angleMeasurement));
    }
  }

  private findExerciseLogId(exerciseId: string): string {
    const session = this.sessionStateHolder.session();

    if (!session) throw new Error('Session not found');

    return session.getExerciseById(exerciseId).id;
  }

  private findMeasurementDefinition(exerciseId: string): AngleMeasurementDefinition | undefined {
    const exercise = this.exerciseStore.getExerciseById(exerciseId);
    if (!exercise) throw new Error(`Exercise with ID ${exerciseId} not found`);

    return exercise.measurementDefinition;
  }
}

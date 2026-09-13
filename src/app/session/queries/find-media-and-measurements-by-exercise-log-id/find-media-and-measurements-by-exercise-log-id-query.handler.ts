import { inject, Injectable } from '@angular/core';
import {
  ExerciseMediaWithMeasurements,
  FindMediaAndMeasurementsByExerciseLogIdQuery,
} from '@session/queries/find-media-and-measurements-by-exercise-log-id/find-media-and-measurements-by-exercise-log-id.query';
import { QueryHandler, QueryResult } from '@common/routers/query/query-handler.interface';
import { Constructor } from '@common/types/constructor.type';
import { MediaRepository } from '@persistence/repository/media.repository';
import { AngleMeasurementRepository } from '@persistence/repository/angle-measurement.repository';
import { AngleMeasurement } from '@domain/model/measurement.model';

@Injectable()
export class FindMediaAndMeasurementsByExerciseLogIdQueryHandler implements QueryHandler<FindMediaAndMeasurementsByExerciseLogIdQuery> {
  private readonly mediaRepository = inject(MediaRepository);
  private readonly angleMeasurementRepository = inject(AngleMeasurementRepository);

  public appliesTo(): Constructor<FindMediaAndMeasurementsByExerciseLogIdQuery> {
    return FindMediaAndMeasurementsByExerciseLogIdQuery;
  }

  public async query({
    exerciseLogId,
  }: FindMediaAndMeasurementsByExerciseLogIdQuery): Promise<
    QueryResult<FindMediaAndMeasurementsByExerciseLogIdQuery>
  > {
    const [exerciseMedia, angleMeasurements] = await Promise.all([
      this.mediaRepository.findAllByExerciseLogId(exerciseLogId),
      this.angleMeasurementRepository.findAllByExerciseLogId(exerciseLogId),
    ]);

    const measurementIndex = angleMeasurements.reduce((lookup, entry) => {
      lookup.set(entry.mediaId, entry);
      return lookup;
    }, new Map<string, AngleMeasurement>());

    return exerciseMedia.map(
      (media) => new ExerciseMediaWithMeasurements(media, measurementIndex.get(media.id)),
    );
  }
}

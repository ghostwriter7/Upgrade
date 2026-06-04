import { Query } from '@common/routers/query/query.model';
import { ExerciseMedia } from '@domain/model/exercise-media.model';
import { AngleMeasurement } from '@domain/model/measurement.model';

export class ExerciseMediaWithMeasurements {
  constructor(public readonly media: ExerciseMedia,
              public readonly measurement?: AngleMeasurement) {
  }
}

export class FindMediaAndMeasurementsByExerciseLogIdQuery extends Query<ExerciseMediaWithMeasurements[]> {
  constructor(public readonly exerciseLogId: string) {
    super();
  }
}

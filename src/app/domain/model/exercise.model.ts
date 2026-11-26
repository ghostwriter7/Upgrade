import { AngleMeasurementDefinition } from '@domain/interface/angle-measurement-definition.interface';
import { ExerciseSetType } from '@domain/model/exercise-set/exercise-set.model';
import { ExerciseType } from '@domain/enum/exercise-types.enum';

export interface Exercise {
  id: string;
  name: string;

  unitsOfMeasurement: ExerciseSetType[] | null;
  isFavourite: boolean;

  measurementDefinition?: AngleMeasurementDefinition;

  stats: {
    lastPerformedAt: Temporal.Instant | null;
    lastPerformedHoursAgo: number | null;
  };

  status: 'active' | 'archived';
  type: ExerciseType;
}

export type UpsertExercisePayload = Pick<
  Exercise,
  'name' | 'id' | 'unitsOfMeasurement' | 'isFavourite' | 'status' | 'type'
>;

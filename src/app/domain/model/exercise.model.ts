import { AngleMeasurementDefinition } from '@domain/interface/angle-measurement-definition.interface';
import { ExerciseSetType } from '@domain/model/exercise-set/exercise-set.model';

export interface Exercise {
  id: string;
  name: string;

  unitsOfMeasurement: ExerciseSetType[] | null;
  isFavourite: boolean;
  skillIds: string[] | null;

  measurementDefinition?: AngleMeasurementDefinition;

  stats: {
    lastPerformedAt: Temporal.Instant | null;
    lastPerformedHoursAgo: number | null;
  };

  skillScore: Record<string, number>;
}

export type UpsertExercisePayload = Pick<
  Exercise,
  'name' | 'id' | 'unitsOfMeasurement' | 'isFavourite' | 'skillIds'
>;

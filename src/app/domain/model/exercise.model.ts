import { AngleMeasurementDefinition } from '@domain/interface/angle-measurement-definition.interface';
import { ExerciseSetType } from '@domain/model/exercise-set/exercise-set.model';

export interface Exercise {
  id: string;
  name: string;

  measurementDefinition?: AngleMeasurementDefinition;
  capabilities?: ExerciseCapability[];
  supportedSetTypes: ExerciseSetType[];

  stats?: {
    lastPerformedAt?: Temporal.Instant;
    lastPerformedHoursAgo?: number;
  };

  skillScore: Record<string, number>;
}

export interface ExerciseCapability {
  capabilityId: string;
  weight: number;
}

import { AngleMeasurementDefinition } from '@domain/interface/angle-measurement-definition.interface';

export interface Exercise {
  id: string;
  name: string;

  measurementDefinition?: AngleMeasurementDefinition;
  capabilities?: ExerciseCapability[];

  stats: {
    lastPerformedAt: Temporal.Instant | null;
    lastPerformedHoursAgo: number | null;
  };

  skillScore: Record<string, number>;
}

export interface ExerciseCapability {
  capabilityId: string;
  weight: number;
}

export type NewExercise = Pick<Exercise, 'name' | 'id'>;

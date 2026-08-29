import { AngleMeasurementDefinition } from '@domain/interface/angle-measurement-definition.interface';
import { ExerciseSetType } from '@domain/model/exercise-set/exercise-set.model';
import { CapabilityId } from '@store/capabilities.const';
import { Skills } from '@domain/enum/skill-tag.enum';

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

  skillScore: {
    [skill in Skills]?: number;
  };
}

export interface ExerciseCapability {
  capabilityId: CapabilityId;
  weight: number;
}

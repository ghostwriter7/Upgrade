import { AngleMeasurementDefinition } from '@domain/interface/angle-measurement-definition.interface';
import { Skills } from '@domain/enum/skill-tag.enum';
import { ExerciseSetType } from '@domain/model/exercise-set/exercise-set.model';
import { CapabilityId } from '@store/capabilities.const';

export interface Exercise {
  id: string;
  name: string;

  measurementDefinition?: AngleMeasurementDefinition;
  skillTags?: Skills[];
  capabilities?: ExerciseCapability[];
  supportedSetTypes: ExerciseSetType[];

  stats?: {
    lastPerformedAt?: Temporal.Instant;
    lastPerformedHoursAgo?: number;
  };
}

export interface ExerciseCapability {
  capabilityId: CapabilityId;
  weight: number;
}

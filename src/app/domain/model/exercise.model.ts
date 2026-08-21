import { AngleMeasurementDefinition } from '@domain/interface/angle-measurement-definition.interface';
import { Skills } from '@domain/enum/skill-tag.enum';
import { ExerciseSetType } from '@domain/model/exercise-set/exercise-set.model';
import { CapabilityId } from '@store/capabilities.const';

export class Exercise {
  public measurementDefinition?: AngleMeasurementDefinition;
  public skillTags?: Skills[];
  public capabilities?: ExerciseCapability[];

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly supportedSetTypes: ExerciseSetType[] = [],
  ) {}
}

export interface ExerciseCapability {
  capabilityId: CapabilityId;
  weight: number;
}

import { AngleMeasurementDefinition } from '@domain/interface/angle-measurement-definition.interface';
import { Skills } from '@domain/enum/skill-tag.enum';
import { ExerciseSetType } from '@domain/model/exercise-set/exercise-set.model';

export class Exercise {
  public measurementDefinition?: AngleMeasurementDefinition;
  public skillTags?: Skills[];

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly supportedSetTypes: ExerciseSetType[] = [],
    public readonly description?: string,
  ) {}
}

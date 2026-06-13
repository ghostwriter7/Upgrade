import { AngleMeasurementDefinition } from '@domain/interface/angle-measurement-definition.interface';
import { Skills } from '@domain/enum/skill-tag.enum';

export class Exercise {
  public measurementDefinition?: AngleMeasurementDefinition;
  public skillTags?: Skills[];

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description?: string,
  ) {}
}

import { AngleMeasurementDefinition } from '@domain/interface/angle-measurement-definition.interface';

export class Exercise {
  public measurementDefinition?: AngleMeasurementDefinition;

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description?: string,
  ) {}
}

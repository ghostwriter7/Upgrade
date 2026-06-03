import { BodyPart } from '@domain/enum/body-part.enum';

export interface AngleMeasurementDefinition {
  readonly landmarks: BodyPart[];
}

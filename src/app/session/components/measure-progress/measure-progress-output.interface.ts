import { Point } from '@domain/model/measurement.model';

export interface MeasureProgressOutput {
  points?: Point[];
  angle?: number;
  image: Blob;
  width: number;
  height: number;
}

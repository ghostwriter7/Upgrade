import { Point } from '@domain/model/measurement.model';

export class Line {
  constructor(
    public readonly start: Point,
    public readonly end: Point
  ) {
  }
}

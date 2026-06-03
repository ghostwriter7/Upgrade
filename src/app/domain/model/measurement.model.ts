import { BodyPart } from '@domain/enum/body-part.enum';

export class AngleMeasurement {
  constructor(
    public readonly id: string,
    public readonly mediaId: string,
    public readonly exerciseId: string,
    public readonly exerciseLogId: string,
    public readonly degrees: number,
    public readonly landmarks: Landmark[],
    public readonly createdAt: Temporal.Instant = Temporal.Now.instant(),
  ) {
  }
}

export class Landmark {
  constructor(
    public readonly point: Point,
    public readonly bodyPart: BodyPart,
  ) {}
}

export class Point {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}
}

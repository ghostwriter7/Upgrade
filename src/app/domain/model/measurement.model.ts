import { BodyPart } from '@domain/enum/body-part.enum';
import { createNanoId } from '@common/function/create-id.function';

export class AngleMeasurement {
  constructor(
    public readonly id: string,
    public readonly mediaId: string,
    public readonly exerciseLogId: string,
    public readonly angle: number,
    public readonly landmarks: Landmark[],
  ) {}

  public static new(
    mediaId: string,
    exerciseLogId: string,
    degrees: number,
    landmarks: Landmark[],
  ): AngleMeasurement {
    return new AngleMeasurement(createNanoId(), mediaId, exerciseLogId, degrees, landmarks);
  }
}

export class Landmark {
  constructor(
    public readonly point: Point,
    public readonly bodyPart?: BodyPart,
  ) {}
}

export class Point {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}

  public normalized(width: number, height: number): Point {
    return new Point(this.x / width, this.y / height);
  }

  public denormalized(width: number, height: number): Point {
    return new Point(this.x * width, this.y * height);
  }
}

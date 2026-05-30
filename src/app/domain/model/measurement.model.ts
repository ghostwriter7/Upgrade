type MeasurementType = 'angle';

enum BodyPart {
  LeftKnee = 'leftKnee',
  PelvisCenter = 'pelvisCenter',
  RightKnee = 'rightKnee',
}

export class Measurement {
  constructor(
    public readonly id: string,
    public readonly mediaId: string,
    public readonly exerciseId: string,
    public readonly setId: number,
    public readonly type: MeasurementType,
  ) {}
}

export class AngleMeasurement extends Measurement {
  constructor(
    id: string,
    mediaId: string,
    exerciseId: string,
    setId: number,
    public readonly degrees: number,
    public readonly landmarks: BodyLandmark[],
  ) {
    super(id, mediaId, exerciseId, setId, 'angle');
  }
}

export class Point {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}
}

export class BodyLandmark {
  constructor(
    public readonly point: Point,
    public readonly bodyPart: BodyPart,
  ) {}
}

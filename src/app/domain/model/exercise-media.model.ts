import { createNanoId } from '@common/function/create-uuid.function';

export class ExerciseMedia {
  constructor(
    public readonly id: string,
    public readonly exerciseId: string,
    public readonly exerciseLogId: string,
    public readonly size: Size,
    public readonly mimeType: 'image/jpeg' = 'image/jpeg',
  ) {}

  public static newImage(
    exerciseId: string,
    exerciseLogId: string,
    width: number,
    height: number,
  ): ExerciseMedia {
    return new ExerciseMedia(
      createNanoId(),
      exerciseId,
      exerciseLogId,
      new Size(width, height),
      'image/jpeg',
    );
  }
}

export class Size {
  constructor(
    public readonly width: number,
    public readonly height: number,
  ) {}
}

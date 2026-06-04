import { createNanoId } from '@common/function/create-uuid.function';
import { DateHelper } from '@common/helper/date.helper';

export class ExerciseMedia {
  constructor(
    public readonly id: string,
    public readonly exerciseId: string,
    public readonly exerciseLogId: string,
    public readonly blob: Blob,
    public readonly size: Size,
    public readonly mimeType: 'image/jpeg' = 'image/jpeg',
    public readonly createdAt: Temporal.Instant = Temporal.Now.instant()
  ) {}

  public static newImage(exerciseId: string, exerciseLogId: string, blob: Blob, width: number, height: number): ExerciseMedia {
    return new ExerciseMedia(
      createNanoId(),
      exerciseId,
      exerciseLogId,
      blob,
      new Size(width, height),
      'image/jpeg',
      DateHelper.now(),
    );
  }
}

export class Size {
  constructor(
    public readonly width: number,
    public readonly height: number
  ) {
  }
}

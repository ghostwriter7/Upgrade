import { createNanoId } from '@common/function/create-uuid.function';
import { DateHelper } from '@common/helper/date.helper';

export class ExerciseMedia {
  constructor(
    public readonly id: string,
    public readonly exerciseId: string,
    public readonly sessionId: string,
    public readonly mimeType: 'image/jpeg',
    public readonly blob: Blob,
    public readonly createdAt: Temporal.Instant,
    public readonly width: number,
    public readonly height: number
  ) {}

  public static newImage(exerciseId: string, sessionId: string, blob: Blob, width: number, height: number): ExerciseMedia {
    return new ExerciseMedia(
      createNanoId(),
      exerciseId,
      sessionId,
      'image/jpeg',
      blob,
      DateHelper.now(),
      width,
      height
    );
  }
}

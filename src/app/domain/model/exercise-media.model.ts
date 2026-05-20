import type { Temporal as TemporalType } from '@js-temporal/polyfill';
import { createUuid } from '../../common/function/create-uuid.function';
import { DateHelper } from '../../common/helper/date.helper';

export class ExerciseMedia {
  constructor(
    public readonly uuid: string,
    public readonly exerciseId: string,
    public readonly sessionId: string,
    public readonly type: 'photo' | 'video',
    public readonly mimeType: 'video/webm',
    public readonly blob: Blob,
    public readonly createdAt: TemporalType.Instant,
  ) {}
}

export class VideoMedia extends ExerciseMedia {
  constructor(
    uuid: string,
    exerciseId: string,
    sessionId: string,
    blob: Blob,
    createdAt: TemporalType.Instant,
    public readonly duration: number,
  ) {
    super(uuid, exerciseId, sessionId, 'video', 'video/webm', blob, createdAt);
  }

  public static newVideo(exerciseId: string, sessionId: string, blob: Blob, duration: number): ExerciseMedia {
    return new VideoMedia(
      createUuid(),
      exerciseId,
      sessionId,
      blob,
      DateHelper.now(),
      duration,
    );
  }
}

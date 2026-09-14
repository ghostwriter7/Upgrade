import { ExerciseLog } from '@domain/model/exercise-log/exercise-log.model';
import { createNanoId } from '@common/function/create-id.function';

export const log = (params: {
  sessionId?: string;
  exerciseId?: string;
  createdAt?: Temporal.Instant;
}): ExerciseLog =>
  new ExerciseLog(
    params.sessionId ?? createNanoId(),
    params.exerciseId ?? 'pull-ups',
    createNanoId(),
    params.createdAt,
  );

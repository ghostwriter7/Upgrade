import {
  BodyweightSet,
  ExerciseSet,
  IsoSet,
  WeightedSet,
} from '@domain/model/exercise-set/exercise-set.model';
import { createNanoId } from '@common/function/create-uuid.function';
const defaultParams = {
  sessionId: 'sessionId',
  exerciseId: 'exerciseId',
};

const commonSet = (
  params: typeof defaultParams,
): Pick<ExerciseSet, 'id' | 'exerciseId' | 'sessionId'> => ({
  id: createNanoId(),
  sessionId: params.sessionId,
  exerciseId: params.exerciseId,
});

export const bwSet = (index: number, reps: number, params = defaultParams): BodyweightSet => ({
  ...commonSet(params),
  index,
  reps,
  type: 'bodyweight',
});

export const isoSet = (
  index: number,
  duration: number,
  weight: number | undefined = undefined,
  params = defaultParams,
): IsoSet => ({
  ...commonSet(params),
  index,
  duration,
  weight,
  type: 'iso',
});

export const weightSet = (
  index: number,
  reps: number,
  weight: number,
  params = defaultParams,
): WeightedSet => ({
  ...commonSet(params),
  index,
  reps,
  weight,
  type: 'weight',
});

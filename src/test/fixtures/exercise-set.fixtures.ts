import {
  BodyweightSet,
  ExerciseSet,
  IsoSet,
  WeightedSet,
} from '@domain/model/exercise-set/exercise-set.model';
import { createNanoId } from '@common/function/create-id.function';

const defaultParams = {
  exerciseLogId: 'exerciseLogId',
  exerciseId: 'exerciseId',
};

const commonSet = (
  params: typeof defaultParams,
): Pick<ExerciseSet, 'id' | 'exerciseLogId' | 'exerciseId'> => ({
  id: createNanoId(),
  exerciseLogId: params.exerciseLogId,
  exerciseId: params.exerciseId,
});

export const bwSet = (index: number, reps: number, params = defaultParams): BodyweightSet => ({
  ...commonSet(params),
  index,
  data: { reps },
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
  data: { duration, weight },
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
  data: { reps, weight },
  type: 'weight',
});

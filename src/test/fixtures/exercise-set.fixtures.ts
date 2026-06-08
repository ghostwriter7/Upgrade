import { BodyweightSet, IsoSet, WeightedSet } from '@domain/model/exercise-set/exercise-set.model';
const defaultParams = {
  sessionId: 'sessionId',
  exerciseId: 'exerciseId',
};

export const bwSet = (index: number, reps: number, params = defaultParams) =>
  new BodyweightSet(params.sessionId, params.exerciseId, index, reps);

export const isoSet = (
  index: number,
  duration: number,
  weight: number | undefined = undefined,
  params = defaultParams,
) => new IsoSet(params.sessionId, params.exerciseId, index, duration, weight);

export const weightSet = (index: number, reps: number, weight: number, params = defaultParams) =>
  new WeightedSet(params.sessionId, params.exerciseId, index, reps, weight);

import {
  BodyweightSet,
  DurationSet,
  ExerciseSet,
  IsoSet,
  WeightedSet,
} from '@domain/model/exercise-set/exercise-set.model';

export function compareSet(a: ExerciseSet, b: ExerciseSet): boolean {
  if (a.type !== b.type) return false;

  switch (a.type) {
    case 'bodyweight':
      return a.reps === (b as BodyweightSet).reps;
    case 'weight':
      return a.reps === (b as WeightedSet).reps && a.weight === (b as WeightedSet).weight;
    case 'iso':
      return a.duration === (b as IsoSet).duration && a.weight === (b as IsoSet).duration;
    case 'duration':
      return a.duration === (b as DurationSet).duration;
  }
}

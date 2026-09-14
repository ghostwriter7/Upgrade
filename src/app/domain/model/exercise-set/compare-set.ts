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
      return a.data.reps === (b as BodyweightSet).data.reps;
    case 'weight':
      return (
        a.data.reps === (b as WeightedSet).data.reps &&
        a.data.weight === (b as WeightedSet).data.weight
      );
    case 'iso':
      return (
        a.data.duration === (b as IsoSet).data.duration &&
        a.data.weight === (b as IsoSet).data.weight
      );
    case 'duration':
      return a.data.duration === (b as DurationSet).data.duration;
  }
}

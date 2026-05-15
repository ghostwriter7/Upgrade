import { SetData } from '../set-form';
import {
  BodyweightSet,
  ExerciseSet,
  IsoSet,
  WeightedSet,
} from '../../../domain/model/exercise-set.model';

export class SetDataMapper {
  public static toDomain({ type, weight, reps, duration }: SetData): ExerciseSet {
    if (type) {
      switch (type) {
        case 'bodyweight':
          return new BodyweightSet(reps);
        case 'weight':
          return new WeightedSet(reps, weight);
        case 'iso':
          return new IsoSet(duration, weight);
      }
    }
    throw new Error(`Invalid set type: ${type}`);
  }

  public static toDto(exerciseSet: ExerciseSet): SetData {
    switch (exerciseSet.type) {
      case 'bodyweight':
        return {
          type: 'bodyweight',
          reps: (exerciseSet as BodyweightSet).reps,
          weight: 0,
          duration: 0,
        };
      case 'weight':
        return {
          type: 'weight',
          reps: (exerciseSet as WeightedSet).reps,
          weight: (exerciseSet as WeightedSet).weight,
          duration: 0,
        };
      case 'iso':
        return {
          type: 'iso',
          reps: 0,
          weight: (exerciseSet as IsoSet).weight ?? 0,
          duration: (exerciseSet as IsoSet).duration,
        };
    }
  }
}

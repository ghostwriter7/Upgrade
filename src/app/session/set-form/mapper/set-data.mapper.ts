import { SetData } from '../set-form';
import {
  BodyweightSet,
  ExerciseSet,
  IsoSet,
  WeightedSet,
} from '../../../domain/model/exercise-set.model';

export class SetDataMapper {
  public static toDomain({ type, weight, reps, duration, exposureZone, depth, breathQuality }: SetData): ExerciseSet {
    if (type) {
      switch (type) {
        case 'bodyweight':
          return new BodyweightSet(reps, depth, exposureZone, breathQuality);
        case 'weight':
          return new WeightedSet(reps, weight, depth, exposureZone, breathQuality);
        case 'iso':
          return new IsoSet(duration, depth, exposureZone, breathQuality, weight);
      }
    }
    throw new Error(`Invalid set type: ${type}`);
  }

  public static toDto(exerciseSet: ExerciseSet): SetData {
    const common = {
      breathQuality: exerciseSet.breathQuality,
      depth: exerciseSet.depth,
      exposureZone: exerciseSet.exposureZone,
    };

    switch (exerciseSet.type) {
      case 'bodyweight':
        return {
          ...common,
          type: 'bodyweight',
          reps: (exerciseSet as BodyweightSet).reps,
          weight: 0,
          duration: 0,
        };
      case 'weight':
        return {
          ...common,
          type: 'weight',
          reps: (exerciseSet as WeightedSet).reps,
          weight: (exerciseSet as WeightedSet).weight,
          duration: 0,
        };
      case 'iso':
        return {
          ...common,
          type: 'iso',
          reps: 0,
          weight: (exerciseSet as IsoSet).weight ?? 0,
          duration: (exerciseSet as IsoSet).duration,
        };
    }
  }
}

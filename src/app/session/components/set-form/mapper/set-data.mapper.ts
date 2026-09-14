import { SetData } from '../set-data.interface';
import {
  BodyweightSet,
  DurationSet,
  ExerciseSet,
  IsoSet,
  WeightedSet,
} from '@domain/model/exercise-set/exercise-set.model';

const emptySetData: Omit<SetData, 'type'> = {
  reps: 0,
  weight: 0,
  duration: 0,
};

export class SetDataMapper {
  public static toDomain(
    { type, weight, reps, duration }: SetData,
    exerciseId: string,
    exerciseLogId: string,
    index: number = 0,
  ): ExerciseSet {
    const commonSet = {
      exerciseId,
      exerciseLogId,
      index,
      type,
    };

    switch (type) {
      case 'bodyweight':
        return { ...commonSet, data: { reps } } as BodyweightSet;
      case 'weight':
        return { ...commonSet, data: { reps, weight } } as WeightedSet;
      case 'iso':
        return { ...commonSet, data: { duration, weight } } as IsoSet;
      case 'duration':
        return { ...commonSet, data: { duration } } as DurationSet;
    }
  }

  public static toDto(exerciseSet: ExerciseSet): SetData {
    const { type, data } = exerciseSet;
    switch (type) {
      case 'bodyweight':
        return { ...emptySetData, reps: data.reps, type };
      case 'weight':
        return { ...emptySetData, reps: data.reps, weight: data.weight, type };
      case 'iso':
        return {
          ...emptySetData,
          duration: data.duration,
          weight: data.weight ?? 0,
          type,
        };
      case 'duration':
        return { ...emptySetData, duration: data.duration, type };
    }
  }
}

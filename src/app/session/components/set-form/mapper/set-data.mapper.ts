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
    sessionId: string,
    index: number = 0,
  ): ExerciseSet {
    const commonSet = {
      exerciseId,
      sessionId,
      index,
      type,
    };

    switch (type) {
      case 'bodyweight':
        return { ...commonSet, reps } as BodyweightSet;
      case 'weight':
        return { ...commonSet, reps, weight } as WeightedSet;
      case 'iso':
        return { ...commonSet, duration, weight } as IsoSet;
      case 'duration':
        return { ...commonSet, duration } as DurationSet;
    }
  }

  public static toDto(exerciseSet: ExerciseSet): SetData {
    const { type } = exerciseSet;
    switch (type) {
      case 'bodyweight':
        return { ...emptySetData, reps: exerciseSet.reps, type };
      case 'weight':
        return { ...emptySetData, reps: exerciseSet.reps, weight: exerciseSet.weight, type };
      case 'iso':
        return {
          ...emptySetData,
          duration: exerciseSet.duration,
          weight: exerciseSet.weight ?? 0,
          type,
        };
      case 'duration':
        return { ...emptySetData, duration: exerciseSet.duration, type };
    }
  }
}

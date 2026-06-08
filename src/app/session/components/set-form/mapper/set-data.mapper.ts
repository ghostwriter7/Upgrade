import { SetData } from '../set-data.interface';
import {
  BodyweightSet,
  BodyweightSetBuilder,
  ExerciseSet,
  ExerciseSetBuilder,
  ExerciseSetType,
  IsoSet,
  IsoSetBuilder,
  WeightedSet,
  WeightSetBuilder,
} from '@domain/model/exercise-set/exercise-set.model';

export class SetDataMapper {
  public static toDomain(
    { type, weight, reps, duration }: SetData,
    exerciseId: string,
    sessionId: string,
    index: number = 0
  ): ExerciseSet {
    const builder = this.getBuilderFor(type)
      .withSessionId(sessionId)
      .withExerciseId(exerciseId)
      .withIndex(index);

    switch (type) {
      case 'bodyweight':
        return (builder as BodyweightSetBuilder).withReps(reps).build();
      case 'weight':
        return (builder as WeightSetBuilder).withReps(reps).withWeight(weight).build();
      case 'iso':
        return (builder as IsoSetBuilder).withDuration(duration).withWeight(weight).build();
    }
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

  private static getBuilderFor(type: ExerciseSetType): ExerciseSetBuilder {
    switch (type) {
      case 'bodyweight':
        return new BodyweightSetBuilder();
      case 'iso':
        return new IsoSetBuilder();
      case 'weight':
        return new WeightSetBuilder();
    }
  }
}

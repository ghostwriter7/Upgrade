import { ExerciseSetDto } from '../../schema/set.schema';
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
} from '../../../domain/model/exercise-set.model';
import { Mapper } from '../mapper.interface';

export class ExerciseSetMapper implements Mapper<ExerciseSet, ExerciseSetDto> {
  public static readonly INSTANCE = new ExerciseSetMapper();

  public toDomain(setDto: ExerciseSetDto): ExerciseSet {
    const { sessionId, exerciseId, id, index } = setDto;
    const builder = ExerciseSetMapper.getBuilderFor(setDto.type);

    builder.withSessionId(sessionId).withExerciseId(exerciseId).withId(id).withIndex(index);

    switch (setDto.type) {
      case 'bodyweight':
        return (builder as BodyweightSetBuilder).withReps(setDto.reps).build();
      case 'weight':
        return (builder as WeightSetBuilder)
          .withReps(setDto.reps)
          .withWeight(setDto.weight)
          .build();
      case 'iso':
        return (builder as IsoSetBuilder)
          .withDuration(setDto.duration)
          .withWeight(setDto.weight)
          .build();
    }
  }

  public toDto(set: ExerciseSet): ExerciseSetDto {
    const common: Pick<ExerciseSet, 'exerciseId' | 'sessionId' | 'index' | 'id'> = {
      sessionId: set.sessionId,
      exerciseId: set.exerciseId,
      index: set.index,
      ...(set.id !== undefined && { id: set.id }),
    };

    if (set instanceof BodyweightSet) return { ...common, type: 'bodyweight', reps: set.reps };

    if (set instanceof WeightedSet)
      return { ...common, type: 'weight', reps: set.reps, weight: set.weight };

    if (set instanceof IsoSet)
      return { ...common, type: 'iso', duration: set.duration, weight: set.weight };

    throw new Error(`Unsupported exercise set type: ${set.constructor.name}`);
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

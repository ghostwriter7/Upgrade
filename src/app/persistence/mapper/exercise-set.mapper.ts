import { ExerciseSetDto } from '../schema/session.schema';
import {
  BodyweightSet,
  ExerciseSet,
  IsoSet,
  WeightedSet,
} from '../../domain/model/exercise-set.model';

export class ExerciseSetMapper {
  public static toDomain(setDto: ExerciseSetDto): ExerciseSet {
    switch (setDto.type) {
      case 'bodyweight': return new BodyweightSet(setDto.reps);
      case 'weight': return new WeightedSet(setDto.reps, setDto.weight);
      case 'iso': return new IsoSet(setDto.duration, setDto.weight);
    }
  }

  public static toDto(set: ExerciseSet): ExerciseSetDto {
    if (set instanceof BodyweightSet)
      return { type: 'bodyweight', reps: set.reps };

    if (set instanceof WeightedSet)
      return { type: 'weight', reps: set.reps, weight: set.weight };

    if (set instanceof IsoSet)
      return { type: 'iso', duration: set.duration, weight: set.weight };

    throw new Error(`Unsupported exercise set type: ${set.constructor.name}`);
  }
}

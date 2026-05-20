import { ExerciseSetDto } from '../schema/session.schema';
import {
  BodyweightSet,
  ExerciseSet,
  IsoSet,
  WeightedSet,
} from '../../domain/model/exercise-set.model';
import { Mapper } from './mapper.interface';

export class ExerciseSetMapper implements Mapper<ExerciseSet, ExerciseSetDto>{
  public static readonly INSTANCE = new ExerciseSetMapper();

  public toDomain(setDto: ExerciseSetDto): ExerciseSet {
    const { depth, exposureZone, breathQuality } = setDto;
    switch (setDto.type) {
      case 'bodyweight': return new BodyweightSet(setDto.reps, depth, exposureZone, breathQuality);
      case 'weight': return new WeightedSet(setDto.reps, setDto.weight, depth, exposureZone, breathQuality);
      case 'iso': return new IsoSet(setDto.duration, depth, exposureZone, breathQuality, setDto.weight);
    }
  }

  public toDto(set: ExerciseSet): ExerciseSetDto {
    const common: Pick<ExerciseSet, 'exposureZone' | 'breathQuality' | 'depth'> = { depth: set.depth, breathQuality: set.breathQuality, exposureZone: set.exposureZone };

    if (set instanceof BodyweightSet)
      return { ...common, type: 'bodyweight', reps: set.reps };

    if (set instanceof WeightedSet)
      return { ...common, type: 'weight', reps: set.reps, weight: set.weight };

    if (set instanceof IsoSet)
      return { ...common, type: 'iso', duration: set.duration, weight: set.weight };

    throw new Error(`Unsupported exercise set type: ${set.constructor.name}`);
  }
}

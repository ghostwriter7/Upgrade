import { ExerciseSetDto } from '../../schema/set.schema';
import { ExerciseSet } from '@domain/model/exercise-set/exercise-set.model';
import { Mapper } from '../mapper.interface';

export class ExerciseSetMapper implements Mapper<ExerciseSet, ExerciseSetDto> {
  public static readonly INSTANCE = new ExerciseSetMapper();

  public toDomain(setDto: ExerciseSetDto): ExerciseSet {
    return { ...setDto };
  }

  public toDto(set: ExerciseSet): ExerciseSetDto {
    return { ...set };
  }
}

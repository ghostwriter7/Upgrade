import { ExerciseEntryDto } from '../schema/session.schema';
import { ExerciseLog } from '../../domain/model/session.model';
import { ExerciseSetMapper } from './exercise-set.mapper';

export class ExerciseEntryMapper {
  public static toDomain(exerciseEntryDto: ExerciseEntryDto): ExerciseLog {
    const exerciseEntry = new ExerciseLog(exerciseEntryDto.exerciseId);
    exerciseEntry.notes = exerciseEntryDto.notes;
    exerciseEntry.sets = exerciseEntryDto.sets.map(ExerciseSetMapper.toDomain);
    return exerciseEntry;
  }

  public static toDto(exerciseEntry: ExerciseLog): ExerciseEntryDto {
    return {
      exerciseId: exerciseEntry.exerciseId,
      notes: exerciseEntry.notes,
      sets: exerciseEntry.sets.map(ExerciseSetMapper.toDto),
    }
  }
}

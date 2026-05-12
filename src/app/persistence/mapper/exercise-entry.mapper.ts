import { ExerciseEntryDto } from '../schema/session.schema';
import { ExerciseEntry } from '../../domain/model/session.model';
import { ExerciseSetMapper } from './exercise-set.mapper';

export class ExerciseEntryMapper {
  public static toDomain(exerciseEntryDto: ExerciseEntryDto): ExerciseEntry {
    const exerciseEntry = new ExerciseEntry(exerciseEntryDto.exerciseId);
    exerciseEntry.notes = exerciseEntryDto.notes;
    exerciseEntry.sets = exerciseEntryDto.sets.map(ExerciseSetMapper.toDomain);
    return exerciseEntry;
  }

  public static toDto(exerciseEntry: ExerciseEntry): ExerciseEntryDto {
    return {
      exerciseId: exerciseEntry.exerciseId,
      notes: exerciseEntry.notes,
      sets: exerciseEntry.sets.map(ExerciseSetMapper.toDto),
    }
  }
}

import { ExerciseEntryDto } from '../../schema/session.schema';
import { ExerciseLog } from '../../../domain/model/session.model';
import { Mapper } from '../mapper.interface';

export class ExerciseEntryMapper implements Mapper<ExerciseLog, ExerciseEntryDto> {
  public static readonly INSTANCE = new ExerciseEntryMapper();

  public toDomain(exerciseEntryDto: ExerciseEntryDto): ExerciseLog {
    const exerciseEntry = new ExerciseLog(exerciseEntryDto.exerciseId);
    exerciseEntry.notes = exerciseEntryDto.notes;
    exerciseEntry.mediaIds = exerciseEntryDto.mediaIds;
    return exerciseEntry;
  }

  public toDto(exerciseEntry: ExerciseLog): ExerciseEntryDto {
    return {
      exerciseId: exerciseEntry.exerciseId,
      notes: exerciseEntry.notes,
      mediaIds: exerciseEntry.mediaIds
    }
  }
}

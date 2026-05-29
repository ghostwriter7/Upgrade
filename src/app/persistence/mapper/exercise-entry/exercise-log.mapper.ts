import { ExerciseLog } from '../../../domain/model/session.model';
import { Mapper } from '../mapper.interface';
import { ExerciseLogDto } from '../../schema/exercise-log.schema';

export class ExerciseLogMapper implements Mapper<ExerciseLog, ExerciseLogDto> {
  public static readonly INSTANCE = new ExerciseLogMapper();

  public toDomain(exerciseLogDto: ExerciseLogDto): ExerciseLog {
    const exerciseEntry = new ExerciseLog(
      exerciseLogDto.sessionId,
      exerciseLogDto.exerciseId,
      exerciseLogDto.id,
    );
    exerciseEntry.notes = exerciseLogDto.notes;
    exerciseEntry.mediaIds = exerciseLogDto.mediaIds;
    return exerciseEntry;
  }

  public toDto(exerciseLog: ExerciseLog): ExerciseLogDto {
    return {
      id: exerciseLog.id,
      sessionId: exerciseLog.sessionId,
      exerciseId: exerciseLog.exerciseId,
      notes: exerciseLog.notes,
      mediaIds: exerciseLog.mediaIds,
    };
  }
}

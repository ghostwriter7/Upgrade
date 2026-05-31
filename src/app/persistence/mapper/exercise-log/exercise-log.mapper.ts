import { Mapper } from '../mapper.interface';
import { ExerciseLogDto } from '../../schema/exercise-log.schema';
import { ExerciseLog } from '@domain/model/exercise-log.model';

export class ExerciseLogMapper implements Mapper<ExerciseLog, ExerciseLogDto> {
  public static readonly INSTANCE = new ExerciseLogMapper();

  public toDomain(exerciseLogDto: ExerciseLogDto): ExerciseLog {
    const exerciseLog = new ExerciseLog(
      exerciseLogDto.sessionId,
      exerciseLogDto.exerciseId,
      exerciseLogDto.id,
    );
    exerciseLog.notes = exerciseLogDto.notes;
    exerciseLog.mediaIds = exerciseLogDto.mediaIds;
    exerciseLog.index = exerciseLogDto.index;
    return exerciseLog;
  }

  public toDto(exerciseLog: ExerciseLog): ExerciseLogDto {
    return {
      id: exerciseLog.id,
      sessionId: exerciseLog.sessionId,
      exerciseId: exerciseLog.exerciseId,
      notes: exerciseLog.notes,
      index: exerciseLog.index,
      mediaIds: exerciseLog.mediaIds,
    };
  }
}

import { Injectable } from '@angular/core';
import { GenericRepository } from './generic.repository';
import { ExerciseLogSchema } from '../schema/exercise-log.schema';
import { ExerciseLogMapper } from '@persistence/mapper/exercise-log/exercise-log.mapper';
import { ExerciseLog } from '@domain/model/exercise-log/exercise-log.model';

@Injectable({ providedIn: 'root' })
export class ExerciseLogRepository extends GenericRepository {
  constructor() {
    super();
  }

  public async findLatestExerciseLogsByExerciseId(
    exerciseId: string,
    limit = 1,
  ): Promise<ExerciseLog[]> {
    const results = await super.queryMany(
      `
      select id,
             exercise_id as exerciseId,
             session_id as sessionId,
             notes,
             log_index as "index",
             created_at as createdAt from exercise_log
      where exercise_id = :exerciseId
      order by created_at desc
      limit :limit
    `,
      { exerciseId, limit },
    );
    return this.toDomain(results);
  }

  public async findLogById(exerciseLogId: string): Promise<ExerciseLog | undefined> {
    const result = await this.queryOne(
      `select id,
       exercise_id as exerciseId,
       session_id as sessionId,
       notes,
       log_index as "index",
       created_at as createdAt from exercise_log where id = :id;`,
      { id: exerciseLogId },
    );
    if (!result) return undefined;
    return ExerciseLogMapper.INSTANCE.toDomain(ExerciseLogSchema.parse(result));
  }

  public async getAllLogsByExerciseId(exerciseId: string): Promise<ExerciseLog[]> {
    const results = await super.queryMany(
      `select id,
       exercise_id as exerciseId,
       session_id as sessionId,
       notes,
       log_index as "index",
       created_at as createdAt from exercise_log where exercise_id = :exerciseId;`,
      { exerciseId },
    );
    return this.toDomain(results);
  }

  public async getAllLogsBySessionId(sessionId: string): Promise<ExerciseLog[]> {
    const results = await super.queryMany(
      `select id,
       exercise_id as exerciseId,
       session_id as sessionId,
       notes,
       log_index as "index",
       created_at as createdAt from exercise_log where session_id = :sessionId;`,
      { sessionId },
    );
    return this.toDomain(results);
  }

  public async getAllLogs(): Promise<ExerciseLog[]> {
    const results = await super.queryMany(`select id,
       exercise_id as exerciseId,
       session_id as sessionId,
       notes,
       log_index as "index",
       created_at as createdAt from exercise_log;`);
    return this.toDomain(results);
  }

  public async deleteAllLogs(): Promise<void> {
    return super.execute('delete from exercise_log;');
  }

  public async saveLog(entity: ExerciseLog): Promise<void> {
    return super.execute(
      `
        insert into exercise_log (id, exercise_id, session_id, notes, log_index, created_at)
        values (:id, :exerciseId, :sessionId, :notes, :logIndex, :createdAt);`,
      {
        id: entity.id,
        exerciseId: entity.exerciseId,
        sessionId: entity.sessionId,
        notes: entity.notes,
        logIndex: entity.index,
        createdAt: entity.createdAt.toString({ smallestUnit: 'seconds' }),
      },
    );
  }

  public async deleteLog(id: string): Promise<void> {
    return super.execute('delete from exercise_log where id = :id;', { id });
  }

  private toDomain(results: unknown[]): ExerciseLog[] {
    return Iterator.from(results)
      .map((r) => ExerciseLogSchema.parse(r))
      .map(ExerciseLogMapper.INSTANCE.toDomain)
      .toArray();
  }
}

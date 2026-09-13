import { GenericRepository } from './generic.repository';
import { ExerciseSet } from '@domain/model/exercise-set/exercise-set.model';
import { Injectable } from '@angular/core';
import { ExerciseSetDto, ExerciseSetSchema } from '../schema/set.schema';

@Injectable({ providedIn: 'root' })
export class SetRepository extends GenericRepository<ExerciseSetDto> {
  constructor() {
    super();
  }

  public async getAllByExerciseLogId(exerciseLogId: string): Promise<ExerciseSet[]> {
    const results = await this.database.queryMany(
      `
     select id, set_index as "index", exercise_log_id as exerciseLogId, type, data
     from exercise_set where exercise_log_id = :exerciseLogId;
    `,
      { exerciseLogId },
    );

    return this.toDomain(results);
  }

  public async getAllBySessionId(sessionId: string): Promise<ExerciseSet[]> {
    const results = await this.database.queryMany(
      `
        select es.id, es.set_index as "index", es.exercise_log_id as exerciseLogId, es.type, es.data
        from exercise_set es
               left join exercise_log el on es.exercise_log_id = el.id
        where el.session_id = :sessionId;
      `,
      { sessionId },
    );
    return this.toDomain(results);
  }

  public async getAllBeExerciseId(exerciseId: string): Promise<ExerciseSet[]> {
    const results = await this.database.queryMany(
      `
          select es.id, es.set_index as "index", es.exercise_log_id as exerciseLogId, es.type, es.data
          from exercise_set es
                   left join exercise_log el on es.exercise_log_id = el.id
          where el.exercise_id = :exerciseId;
      `,
      { exerciseId },
    );
    return this.toDomain(results);
  }

  public deleteAllSets(): Promise<void> {
    return this.database.execute('delete from exercise_set');
  }

  public deleteSet(setId: string): Promise<void> {
    return this.database.execute('delete from exercise_set where id = :setId', { setId });
  }

  public async updateSet(set: ExerciseSet): Promise<void> {
    return this.database.execute(
      `update exercise_set
      set data = :data where id = :id`,
      { data: JSON.stringify(set.data), id: set.id },
    );
  }

  public async createSet(set: ExerciseSet): Promise<void> {
    return this.database.execute(
      `insert into exercise_set (id, exercise_log_id, set_index, type, data)
      values (:id, :exerciseLogId, :index, :type, :data)`,
      {
        id: set.id,
        exerciseLogId: set.exerciseLogId,
        index: set.index,
        type: set.type,
        data: JSON.stringify(set.data),
      },
    );
  }

  private toDomain(results: unknown[]): ExerciseSet[] {
    return Iterator.from(results)
      .map((set) => ExerciseSetSchema.parse(set))
      .toArray()
      .sort((a, b) => a.index - b.index);
  }
}

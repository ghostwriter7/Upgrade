import { Repository } from './repository';
import { ExerciseSet } from '@domain/model/exercise-set/exercise-set.model';
import { Injectable } from '@angular/core';
import { ExerciseSetSchema } from '../schema/set.schema';

const UPDATE_SQL = `update exercise_set set data = :data, set_index = :index where id = :id`;

const toUpdateParam = (set: ExerciseSet) => ({
  data: JSON.stringify(set.data),
  id: set.id,
  index: set.index,
});

@Injectable({ providedIn: 'root' })
export class SetRepository extends Repository {
  constructor() {
    super();
  }

  public async getAllByExerciseLogId(exerciseLogId: string): Promise<ExerciseSet[]> {
    const results = await super.queryMany(
      `
          select es.id,
                 es.set_index       as "index",
                 es.exercise_log_id as exerciseLogId,
                 es.type,
                 es.data,
                 el.exercise_id     as exerciseId
          from exercise_set es
                   left join exercise_log el on es.exercise_log_id = el.id
          where es.exercise_log_id = :exerciseLogId;
      `,
      { exerciseLogId },
    );

    return this.toDomain(results);
  }

  public async getAllBySessionId(sessionId: string): Promise<ExerciseSet[]> {
    const results = await super.queryMany(
      `
          select es.id,
                 es.set_index       as "index",
                 es.exercise_log_id as exerciseLogId,
                 es.type,
                 es.data,
                 el.exercise_id     as exerciseId
          from exercise_set es
                   left join exercise_log el on es.exercise_log_id = el.id
          where el.session_id = :sessionId;
      `,
      { sessionId },
    );
    return this.toDomain(results);
  }

  public async getAllBeExerciseId(exerciseId: string): Promise<ExerciseSet[]> {
    const results = await super.queryMany(
      `
          select es.id,
                 es.set_index       as "index",
                 es.exercise_log_id as exerciseLogId,
                 es.type,
                 es.data,
                 el.exercise_id     as exerciseId
          from exercise_set es
                   left join exercise_log el on es.exercise_log_id = el.id
          where el.exercise_id = :exerciseId;
      `,
      { exerciseId },
    );
    return this.toDomain(results);
  }

  public deleteById(setId: string): Promise<void> {
    return super.execute('delete from exercise_set where id = :setId', { setId });
  }

  public async updateMany(sets: ExerciseSet[]): Promise<void> {
    if (sets.length) return;
    return this.database.executeBatch(UPDATE_SQL, sets.map(toUpdateParam));
  }

  public async update(set: ExerciseSet): Promise<void> {
    return super.execute(UPDATE_SQL, toUpdateParam(set));
  }

  public async save(set: ExerciseSet): Promise<void> {
    return super.execute(
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

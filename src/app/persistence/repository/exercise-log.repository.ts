import { Injectable } from '@angular/core';
import { GenericRepository } from './generic.repository';
import { ExerciseLogDto, ExerciseLogSchema } from '../schema/exercise-log.schema';
import { StoreName } from './store-name.enum';
import { ExerciseLogMapper } from '@persistence/mapper/exercise-log/exercise-log.mapper';
import { IndexName } from './index-name.enum';
import { ExerciseLog } from '@domain/model/exercise-log/exercise-log.model';

@Injectable({ providedIn: 'root' })
export class ExerciseLogRepository extends GenericRepository<ExerciseLogDto> {
  constructor() {
    super();
  }

  public async findLatestExerciseLogsByExerciseId(
    exerciseId: string,
    limit = 1,
  ): Promise<ExerciseLog[]> {
    const tx = await this.createReadTransaction(StoreName.EXERCISE_LOGS);
    const index = tx
      .objectStore(StoreName.EXERCISE_LOGS)
      .index(IndexName.ExerciseLogsByExerciseIdAndCreatedAt);

    const request = index.openCursor(
      IDBKeyRange.bound([exerciseId, ''], [exerciseId, '\uffff']),
      'prev',
    );

    return new Promise((resolve, reject) => {
      const results: ExerciseLog[] = [];

      request.onsuccess = () => {
        const cursor = request.result;

        if (cursor) {
          results.push(ExerciseLogMapper.INSTANCE.toDomain(ExerciseLogSchema.parse(cursor.value)));

          if (results.length === limit) {
            resolve(results);
          } else {
            cursor.continue();
          }
        } else {
          resolve(results);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  public async getAllLogsBySessionId(sessionId: string): Promise<ExerciseLog[]> {
    const logs = await super.findAllBy(StoreName.EXERCISE_LOGS, (store: IDBObjectStore) =>
      store.index(IndexName.ExerciseLogsBySessionId).getAll(sessionId),
    );
    return Iterator.from(logs)
      .map((log) => ExerciseLogSchema.parse(log))
      .map(ExerciseLogMapper.INSTANCE.toDomain)
      .toArray();
  }

  public async getAllLogs(): Promise<ExerciseLog[]> {
    const exerciseLogs = await super.findAll(StoreName.EXERCISE_LOGS);
    return exerciseLogs.map(ExerciseLogMapper.INSTANCE.toDomain);
  }

  public async deleteAllLogs(): Promise<void> {
    return super.deleteAll(StoreName.EXERCISE_LOGS);
  }

  public async deleteAllBySessionId(sessionId: string): Promise<void> {
    return super.deleteAllByIndex(
      StoreName.EXERCISE_LOGS,
      IndexName.ExerciseLogsBySessionId,
      sessionId,
    );
  }

  public async saveLog(entity: ExerciseLog): Promise<IDBValidKey> {
    return super.put(StoreName.EXERCISE_LOGS, ExerciseLogMapper.INSTANCE.toDto(entity));
  }

  public async deleteLog(id: string): Promise<void> {
    return super.delete(StoreName.EXERCISE_LOGS, id);
  }
}

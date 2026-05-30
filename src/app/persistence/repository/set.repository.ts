import { GenericRepository } from './generic.repository';
import { ExerciseSet } from '../../domain/model/exercise-set.model';
import { Injectable } from '@angular/core';
import { StoreName } from './store-name.enum';
import { ExerciseSetMapper } from '../mapper/exercise-set/exercise-set.mapper';
import { ExerciseSetDto } from '../schema/set.schema';
import { IndexName } from './index-name.enum';

@Injectable({ providedIn: 'root' })
export class SetRepository extends GenericRepository<ExerciseSetDto> {
  constructor() {
    super();
  }

  public deleteAllSets(): Promise<void> {
    return super.deleteAll(StoreName.SETS);
  }

  public async deleteBySessionAndExercise(sessionId: string, exerciseId: string): Promise<boolean> {
    const tx = await super.createWriteTransaction([StoreName.SETS]);
    return new Promise((resolve, reject) => {
      tx.oncomplete = (): void => resolve(true);
      tx.onerror = (): void => reject(tx.error);
      tx.onabort = (): void => reject(tx.error);

      const store = tx.objectStore(StoreName.SETS);
      const setBySessionAndExercise = store.index(IndexName.SetBySessionIdAndExerciseId);

      const cursorRequest = setBySessionAndExercise.openCursor(
        IDBKeyRange.only([sessionId, exerciseId]),
      );
      cursorRequest.onsuccess = () => {
        const cursor = cursorRequest.result;

        if (!cursor) return;

        cursor.delete();
        cursor.continue();
      };
    });
  }

  public async deleteAllBySessionId(sessionId: string): Promise<void> {
    return super.deleteAllByIndex(StoreName.SETS, IndexName.SetBySessionId, sessionId);
  }

  public async getAllSets(): Promise<ExerciseSet[]> {
    const sets = await super.findAll(StoreName.SETS);
    return sets.map(ExerciseSetMapper.INSTANCE.toDomain);
  }

  public async getLatestSetId(): Promise<number> {
    const tx = await super.createReadTransaction(StoreName.SETS);
    const request = tx.objectStore(StoreName.SETS).openKeyCursor(null, 'prev');

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const cursor = request.result;

        if (cursor) {
          resolve(Number(cursor.key));
        } else {
          resolve(0);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  public deleteSet(setId: number): Promise<void> {
    return super.delete(StoreName.SETS, setId);
  }

  public async upsertSet(set: ExerciseSet): Promise<number> {
    const dto = ExerciseSetMapper.INSTANCE.toDto(set);
    const key = await super.put(StoreName.SETS, dto);

    if (typeof key === 'number') {
      return key;
    }

    throw new Error('Invalid key type');
  }
}

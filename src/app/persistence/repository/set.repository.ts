import { GenericRepository } from './generic.repository';
import { ExerciseSet } from '@domain/model/exercise-set/exercise-set.model';
import { Injectable } from '@angular/core';
import { StoreName } from './store-name.enum';
import { ExerciseSetMapper } from '../mapper/exercise-set/exercise-set.mapper';
import { ExerciseSetDto, ExerciseSetSchema } from '../schema/set.schema';
import { IndexName } from './index-name.enum';

@Injectable({ providedIn: 'root' })
export class SetRepository extends GenericRepository<ExerciseSetDto> {
  constructor() {
    super();
  }

  public async getAllBySessionIdAndExerciseId(
    sessionId: string,
    exerciseId: string,
  ): Promise<ExerciseSet[]> {
    const sets = await super.findAllBy(StoreName.SETS, (store: IDBObjectStore) =>
      store
        .index(IndexName.SetBySessionIdAndExerciseId)
        .getAll(IDBKeyRange.only([sessionId, exerciseId])),
    );
    return Iterator.from(sets)
      .map((set) => ExerciseSetSchema.parse(set))
      .map(ExerciseSetMapper.INSTANCE.toDomain)
      .toArray()
      .sort((a, b) => a.index - b.index);
  }

  public async getAllBySessionId(sessionId: string): Promise<ExerciseSet[]> {
    const sets = await super.findAllBy(StoreName.SETS, (store: IDBObjectStore) =>
      store.index(IndexName.SetBySessionId).getAll(sessionId),
    );
    return Iterator.from(sets)
      .map((set) => ExerciseSetSchema.parse(set))
      .map(ExerciseSetMapper.INSTANCE.toDomain)
      .toArray();
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

  public deleteSet(setId: string): Promise<void> {
    return super.delete(StoreName.SETS, setId);
  }

  public async upsertSet(set: ExerciseSet): Promise<IDBValidKey> {
    const dto = ExerciseSetMapper.INSTANCE.toDto(set);
    return await super.put(StoreName.SETS, dto);
  }
}

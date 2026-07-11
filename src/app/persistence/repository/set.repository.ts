import { GenericRepository } from './generic.repository';
import { ExerciseSet } from '@domain/model/exercise-set/exercise-set.model';
import { Injectable } from '@angular/core';
import { StoreName } from './store-name.enum';
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
      .toArray()
      .sort((a, b) => a.index - b.index);
  }

  public async getAllBySessionId(sessionId: string): Promise<ExerciseSet[]> {
    const sets = await super.findAllBy(StoreName.SETS, (store: IDBObjectStore) =>
      store.index(IndexName.SetBySessionId).getAll(sessionId),
    );
    return this.parseSets(sets);
  }

  public async getAllBeExerciseId(exerciseId: string): Promise<ExerciseSet[]> {
    const sets = await super.findAllBy(StoreName.SETS, (store: IDBObjectStore) =>
      store.index(IndexName.SetByExerciseId).getAll(exerciseId),
    );
    return this.parseSets(sets);
  }

  private parseSets(sets: unknown[]): ExerciseSet[] {
    return Iterator.from(sets)
      .map((set) => ExerciseSetSchema.parse(set))
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

  public getAllSets(): Promise<ExerciseSet[]> {
    return super.findAll(StoreName.SETS);
  }

  public deleteSet(setId: string): Promise<void> {
    return super.delete(StoreName.SETS, setId);
  }

  public async upsertSet(set: ExerciseSet): Promise<IDBValidKey> {
    return super.put(StoreName.SETS, set);
  }
}

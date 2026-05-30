import { DatabaseVersion } from './database-version.const';
import { Observable, ReplaySubject } from 'rxjs';
import { StoreName } from './store-name.enum';
import { IndexName } from './index-name.enum';
import { createUuid } from '../../common/function/create-uuid.function';

export function databaseFactory(): Observable<IDBDatabase> {
  const db = indexedDB.open('upgrade', DatabaseVersion);
  const databaseSubject = new ReplaySubject<IDBDatabase>(1);

  db.onupgradeneeded = (event: IDBVersionChangeEvent): void => {
    const { result: db, transaction: tx } = event.target as IDBRequest;

    console.log(`Upgrading to version ${db.version}`);

    const existingObjectStores = db.objectStoreNames;
    if (!existingObjectStores.contains(StoreName.SESSIONS)) {
      const store = db.createObjectStore(StoreName.SESSIONS, { keyPath: 'uuid' });
      store.createIndex(IndexName.SessionByStartedAt, 'startedAt', { unique: false });
    }

    if (!existingObjectStores.contains(StoreName.MEDIA)) {
      const store = db.createObjectStore(StoreName.MEDIA, { keyPath: 'uuid' });
      store.createIndex(IndexName.MediaByExerciseId, 'exerciseId', { unique: false });
      store.createIndex(IndexName.MediaBySessionIdAndExerciseId, ['sessionId', 'exerciseId'], {
        unique: false,
      });
    }

    if (!existingObjectStores.contains(StoreName.SETS)) {
      const store = db.createObjectStore(StoreName.SETS, { keyPath: 'id' });
      store.createIndex(IndexName.SetBySessionId, 'sessionId', { unique: false });
      store.createIndex(IndexName.SetByExerciseId, 'exerciseId', { unique: false });
    }

    if (!existingObjectStores.contains(StoreName.EXERCISE_LOGS)) {
      const store: IDBObjectStore = db.createObjectStore(StoreName.EXERCISE_LOGS, {
        keyPath: 'id',
      });
      store.createIndex(IndexName.ExerciseLogsBySessionId, 'sessionId', { unique: false });
      store.createIndex(IndexName.ExerciseLogsByExerciseId, 'exerciseId', { unique: false });
    }

    const setStore = tx!.objectStore(StoreName.SETS);
    if (!setStore.indexNames.contains(IndexName.SetBySessionIdAndExerciseId)) {
      setStore.createIndex(IndexName.SetBySessionIdAndExerciseId, ['sessionId', 'exerciseId'], {
        unique: false,
      });
    }

    const mediaStore = tx!.objectStore(StoreName.MEDIA);
    if (!mediaStore.indexNames.contains(IndexName.MediaBySessionId)) {
      mediaStore.createIndex(IndexName.MediaBySessionId, 'sessionId', { unique: false });
    }

    const request = setStore.getAll();
    request.onsuccess = () => {
      const sets = request.result;
      const deleteRequest = setStore.clear();
      deleteRequest.onsuccess = ( ) => {
        sets.map((set) => ({
          ...set,
          id: createUuid()
        })).forEach((set) => setStore.put(set));
      }
    };
  };

  db.onsuccess = (event: Event): void => databaseSubject.next(db.result);

  db.onerror = (event: Event): void =>
    databaseSubject.error(new Error('Database initialization error'));

  return databaseSubject.asObservable();
}

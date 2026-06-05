import { DatabaseVersion } from './database-version.const';
import { Observable, ReplaySubject } from 'rxjs';
import { StoreName } from './store-name.enum';
import { IndexName } from './index-name.enum';

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

    if (existingObjectStores.contains(StoreName.MEDIA)) {
      const mediaStore = tx!.objectStore(StoreName.MEDIA);
      if (mediaStore?.keyPath === 'uuid') {
        db.deleteObjectStore(StoreName.MEDIA);
        const store = db.createObjectStore(StoreName.MEDIA, { keyPath: 'id' });
        store.createIndex(IndexName.MediaByExerciseId, 'exerciseId', { unique: false });
        store.createIndex(IndexName.MediaByExerciseLogId, 'exerciseLogId', {
          unique: false,
        });
      }
    } else {
      const store = db.createObjectStore(StoreName.MEDIA, { keyPath: 'id' });
      store.createIndex(IndexName.MediaByExerciseId, 'exerciseId', { unique: false });
      store.createIndex(IndexName.MediaByExerciseLogId, 'exerciseLogId', {
        unique: false,
      });
    }

    if (!existingObjectStores.contains(StoreName.ANGLE_MEASUREMENTS)) {
      const store = db.createObjectStore(StoreName.ANGLE_MEASUREMENTS, { keyPath: 'id' });
      store.createIndex(IndexName.AngleMeasurementsByExerciseLogId, 'exerciseLogId', { unique: false });
      store.createIndex(IndexName.AngleMeasurementsByExerciseId, 'exerciseId', { unique: false });
    }
  };

  db.onsuccess = (event: Event): void => databaseSubject.next(db.result);

  db.onerror = (event: Event): void =>
    databaseSubject.error(new Error('Database initialization error'));

  return databaseSubject.asObservable();
}

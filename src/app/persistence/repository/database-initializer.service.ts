import { DatabaseVersion } from './database-version.const';
import { Observable, ReplaySubject } from 'rxjs';
import { StoreName } from './store-name.enum';
import { IndexName } from './index-name.enum';
import { SessionSchema } from '../schema/session.schema';
import { createUuid } from '../../common/function/create-uuid.function';

export function databaseFactory(): Observable<IDBDatabase> {
  const db = indexedDB.open('upgrade', DatabaseVersion);
  const databaseSubject = new ReplaySubject<IDBDatabase>(1);

  db.onupgradeneeded = (event: IDBVersionChangeEvent): void => {
    const { result: db, transaction: tx } = (event.target as IDBRequest);

    console.log(`Upgrading to version ${db.version}`);

    const existingObjectStores = db.objectStoreNames;
    if (!existingObjectStores.contains(StoreName.SESSIONS)) {
      const store = db.createObjectStore(StoreName.SESSIONS, { keyPath: 'uuid' });
      store.createIndex(IndexName.StartedAt, 'startedAt', { unique: false });
    }

    if (!existingObjectStores.contains(StoreName.MEDIA)) {
      const store = db.createObjectStore(StoreName.MEDIA, { keyPath: 'uuid'});
      store.createIndex(IndexName.MediaByExerciseId, 'exerciseId', { unique: false });
      store.createIndex(IndexName.MediaBySessionAndExercise, ['sessionId', 'exerciseId'], { unique: false });
    }

    if (!existingObjectStores.contains(StoreName.SETS)) {
      const store = db.createObjectStore(StoreName.SETS, { keyPath: 'id' });
      store.createIndex(IndexName.SetBySession, 'sessionId', { unique: false });
      store.createIndex(IndexName.SetByExercise, 'exerciseId', { unique: false });
    }

    if (!existingObjectStores.contains(StoreName.EXERCISE_LOGS)) {
      const store: IDBObjectStore = db.createObjectStore(StoreName.EXERCISE_LOGS, { keyPath: 'id' });
      store.createIndex(IndexName.ExerciseLogsBySession, 'sessionId', { unique: false });
      store.createIndex(IndexName.ExerciseLogsByExercise, 'exerciseId', { unique: false });


      const sessionsStore = tx!.objectStore(StoreName.SESSIONS);
      const request = sessionsStore.getAll();
      request.onsuccess = (e) => {
        debugger
        const sessions = request.result.map((entry) => SessionSchema.parse(entry));
        const exerciseLogs = sessions.flatMap((session) => session.exerciseEntries
          .map((entry) => ({ ...entry, sessionId: session.uuid, id: createUuid() })))

        exerciseLogs.forEach((log) => store.put(log));
        alert(`Saved ${exerciseLogs.length} exercise logs`);
      }
    }
  };

  db.onsuccess = (event: Event): void => databaseSubject.next(db.result);

  db.onerror = (event: Event): void =>
    databaseSubject.error(new Error('Database initialization error'));

  return databaseSubject.asObservable();
}

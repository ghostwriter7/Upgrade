import { StoreName } from '@persistence/repository/store-name.enum';
import { IndexName } from '@persistence/repository/index-name.enum';
import { Migration } from '@persistence/migrations/migration.interface';

export class CreateBaseStoresMigration implements Migration {
  public apply(db: IDBDatabase, tx: IDBTransaction): void {
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
  }
}

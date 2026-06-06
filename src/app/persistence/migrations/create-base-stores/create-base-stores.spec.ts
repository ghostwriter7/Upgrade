import { CreateBaseStoresMigration } from '@persistence/migrations/create-base-stores/create-base-stores';
import { StoreName } from '@persistence/repository/store-name.enum';
import { IndexName } from '@persistence/repository/index-name.enum';
import { mockDatabase, mockStore } from '@test/mocks/database.mock';

describe('CreateBaseStores', () => {
  it('should do nothing when stores already exist', () => {
    const db = mockDatabase({ storeExists: true });

    new CreateBaseStoresMigration().apply(db as unknown as IDBDatabase, {} as IDBTransaction);

    expect(db.createObjectStore).not.toHaveBeenCalled();
    expect(db.objectStoreNames.contains).toHaveBeenNthCalledWith(1, StoreName.SESSIONS);
    expect(db.objectStoreNames.contains).toHaveBeenNthCalledWith(2, StoreName.SETS);
    expect(db.objectStoreNames.contains).toHaveBeenNthCalledWith(3, StoreName.EXERCISE_LOGS);
  });

  it('should create stores and indexes', () => {
    const db = mockDatabase({ storeExists: false });
    const sessionStore = mockStore();
    const setStore = mockStore();
    const exerciseLogStore = mockStore();
    db.createObjectStore
      .mockReturnValueOnce(sessionStore.store)
      .mockReturnValueOnce(setStore.store)
      .mockReturnValueOnce(exerciseLogStore.store);

    new CreateBaseStoresMigration().apply(db as unknown as IDBDatabase, {} as IDBTransaction);

    expect(db.createObjectStore).toHaveBeenCalledTimes(3);
    expect(db.createObjectStore).toHaveBeenCalledWith(StoreName.SESSIONS, { keyPath: 'uuid' });
    sessionStore.assertCreateIndex(1, IndexName.SessionByStartedAt, 'startedAt');

    expect(db.createObjectStore).toHaveBeenCalledWith(StoreName.SETS, { keyPath: 'id' });
    setStore.assertCreateIndex(1, IndexName.SetBySessionId, 'sessionId');
    setStore.assertCreateIndex(2, IndexName.SetByExerciseId, 'exerciseId');

    expect(db.createObjectStore).toHaveBeenCalledWith(StoreName.EXERCISE_LOGS, { keyPath: 'id' });
    exerciseLogStore.assertCreateIndex(1, IndexName.ExerciseLogsBySessionId, 'sessionId');
    exerciseLogStore.assertCreateIndex(2, IndexName.ExerciseLogsByExerciseId, 'exerciseId');
  });
});

import { mockStore, mockTx } from '@test/mocks/database.mock';
import { IndexName } from '@persistence/repository/index-name.enum';
import {
  IndexExerciseLogByCreatedAtMigration
} from '@persistence/migrations/index-exercise-log-by-created-at/index-exercise-log-by-created-at';

describe('IndexExerciseLogByCreatedAtMigration', () => {
  it('should do nothing when an index exists', () => {
    const storeHandle = mockStore({ existingIndexes: [IndexName.ExerciseLogsByExerciseIdAndCreatedAt] });
    const tx = mockTx(storeHandle.store);

    new IndexExerciseLogByCreatedAtMigration().apply({} as unknown as IDBDatabase, tx as unknown as IDBTransaction);

    storeHandle.assertIndexCheck(1, IndexName.ExerciseLogsByExerciseIdAndCreatedAt);
    storeHandle.assertNoCreateIndex();
    expect.assertions(2);
  });

  it('should create an index and apply a data fix', () => {
    const storeHandle = mockStore();
    const exerciseLogStore = mockStore();
    const tx = mockTx(storeHandle.store);
    tx.objectStore
      .mockReturnValueOnce(storeHandle)
      .mockReturnValueOnce(exerciseLogStore);

    new IndexExerciseLogByCreatedAtMigration().apply(
      {} as unknown as IDBDatabase,
      tx as unknown as IDBTransaction,
    );

    storeHandle.assertIndexCheck(1, IndexName.ExerciseLogsByExerciseIdAndCreatedAt);
    storeHandle.assertCreateIndex(1, IndexName.ExerciseLogsByExerciseIdAndCreatedAt, ['exerciseId', 'createdAt']);
  });
});

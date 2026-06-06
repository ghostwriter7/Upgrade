import { StoreName } from '@persistence/repository/store-name.enum';
import { IndexName } from '@persistence/repository/index-name.enum';
import { CreateSetBySessionIdAndExerciseIdIndexMigration } from '@persistence/migrations/create-set-by-session-id-and-exercise-id-index/create-set-by-session-id-and-exercise-id-index';
import { mockStore, mockTx } from '@test/mocks/database.mock';

describe('CreateSetBySessionIdAndExerciseIdIndexMigration', () => {

  it('should do nothing when index already exists', () => {
    const storeMock = mockStore({ existingIndexes: [IndexName.SetBySessionIdAndExerciseId] });
    const tx = mockTx(storeMock.store);

    new CreateSetBySessionIdAndExerciseIdIndexMigration().apply({} as IDBDatabase, tx as unknown as IDBTransaction);

    expect(tx.objectStore).toHaveBeenCalledExactlyOnceWith(StoreName.SETS);
    storeMock.assertIndexCheck(1, IndexName.SetBySessionIdAndExerciseId);
    storeMock.assertNoCreateIndex();
  });

  it('should create an index when one does not exist', () => {
    const storeMock = mockStore();
    const tx = mockTx(storeMock.store);

    new CreateSetBySessionIdAndExerciseIdIndexMigration().apply(
      {} as IDBDatabase,
      tx as unknown as IDBTransaction,
    );

    expect(tx.objectStore).toHaveBeenCalledExactlyOnceWith(StoreName.SETS);
    storeMock.assertIndexCheck(1, IndexName.SetBySessionIdAndExerciseId);
    storeMock.assertCreateIndex(
      1,
      IndexName.SetBySessionIdAndExerciseId,
      ['sessionId', 'exerciseId'],
      { unique: false },
    );
  });
});

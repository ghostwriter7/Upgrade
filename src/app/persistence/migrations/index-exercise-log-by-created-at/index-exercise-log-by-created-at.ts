import { Migration } from '@persistence/migrations/migration.interface';
import { StoreName } from '@persistence/repository/store-name.enum';
import { IndexName } from '@persistence/repository/index-name.enum';

export class IndexExerciseLogByCreatedAtMigration implements Migration {
  public apply(db: IDBDatabase, tx: IDBTransaction): void {
    const store = tx.objectStore(StoreName.EXERCISE_LOGS);
    if (!store.indexNames.contains(IndexName.ExerciseLogsByExerciseIdAndCreatedAt)) {
      store.createIndex(
        IndexName.ExerciseLogsByExerciseIdAndCreatedAt,
        ['exerciseId', 'createdAt'],
        { unique: false },
      );
    }
  }
}

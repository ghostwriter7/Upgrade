import { StoreName } from '@persistence/repository/store-name.enum';
import { IndexName } from '@persistence/repository/index-name.enum';
import { Migration } from '../migration.interface';

export class CreateSetBySessionIdAndExerciseIdIndexMigration implements Migration {
  public apply(db: IDBDatabase, tx: IDBTransaction): void {
    const setStore = tx.objectStore(StoreName.SETS);
    if (!setStore.indexNames.contains(IndexName.SetBySessionIdAndExerciseId)) {
      setStore.createIndex(IndexName.SetBySessionIdAndExerciseId, ['sessionId', 'exerciseId'], {
        unique: false,
      });
    }
  }
}

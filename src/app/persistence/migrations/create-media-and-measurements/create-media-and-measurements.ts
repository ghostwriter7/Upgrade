import { Migration } from '@persistence/migrations/migration.interface';
import { StoreName } from '@persistence/repository/store-name.enum';
import { IndexName } from '@persistence/repository/index-name.enum';

export class CreateMediaAndMeasurementsMigration implements Migration {
  public apply(db: IDBDatabase, tx: IDBTransaction): void {
    const existingObjectStores = db.objectStoreNames;

    if (!existingObjectStores.contains(StoreName.MEDIA)) {
      const store = db.createObjectStore(StoreName.MEDIA, { keyPath: 'id' });
      store.createIndex(IndexName.MediaByExerciseId, 'exerciseId', { unique: false });
      store.createIndex(IndexName.MediaByExerciseLogId, 'exerciseLogId', {
        unique: false,
      });
    }

    if (!existingObjectStores.contains(StoreName.ANGLE_MEASUREMENTS)) {
      const store = db.createObjectStore(StoreName.ANGLE_MEASUREMENTS, { keyPath: 'id' });
      store.createIndex(IndexName.AngleMeasurementsByExerciseLogId, 'exerciseLogId', {
        unique: false,
      });
      store.createIndex(IndexName.AngleMeasurementsByExerciseId, 'exerciseId', { unique: false });
    }
  }
}

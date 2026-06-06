import { StoreName } from '@persistence/repository/store-name.enum';
import { IndexName } from '@persistence/repository/index-name.enum';
import { CreateMediaAndMeasurementsMigration } from '@persistence/migrations/create-media-and-measurements/create-media-and-measurements';
import { mockDatabase, mockStore } from '@test/mocks/database.mock';

describe('CreateMediaAndMeasurements', () => {
  it('should do nothing when stores already exist', () => {
    const db = mockDatabase({ storeExists: true });

    new CreateMediaAndMeasurementsMigration().apply(
      db as unknown as IDBDatabase,
      {} as IDBTransaction,
    );

    expect(db.objectStoreNames.contains).toHaveBeenNthCalledWith(1, StoreName.MEDIA);
    expect(db.objectStoreNames.contains).toHaveBeenNthCalledWith(2, StoreName.ANGLE_MEASUREMENTS);
    expect(db.createObjectStore).not.toHaveBeenCalled();
  });

  it('should create stores and indexes', () => {
    const db = mockDatabase({ storeExists: false });
    const mediaStore = mockStore();
    const angleMeasurementsStore = mockStore();
    db.createObjectStore
      .mockReturnValueOnce(mediaStore.store)
      .mockReturnValueOnce(angleMeasurementsStore.store);

    new CreateMediaAndMeasurementsMigration().apply(
      db as unknown as IDBDatabase,
      {} as IDBTransaction,
    );

    expect(db.createObjectStore).toHaveBeenCalledTimes(2);
    expect(db.createObjectStore).toHaveBeenCalledWith(StoreName.MEDIA, { keyPath: 'id' });
    mediaStore.assertCreateIndex(1, IndexName.MediaByExerciseId, 'exerciseId');
    mediaStore.assertCreateIndex(2, IndexName.MediaByExerciseLogId, 'exerciseLogId');

    expect(db.createObjectStore).toHaveBeenCalledWith(StoreName.ANGLE_MEASUREMENTS, {
      keyPath: 'id',
    });
    angleMeasurementsStore.assertCreateIndex(
      1,
      IndexName.AngleMeasurementsByExerciseLogId,
      'exerciseLogId',
    );
    angleMeasurementsStore.assertCreateIndex(
      2,
      IndexName.AngleMeasurementsByExerciseId,
      'exerciseId',
    );
  });
});

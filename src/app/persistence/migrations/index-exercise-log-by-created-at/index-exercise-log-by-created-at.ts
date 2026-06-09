import { Migration } from '@persistence/migrations/migration.interface';
import { StoreName } from '@persistence/repository/store-name.enum';
import { IndexName } from '@persistence/repository/index-name.enum';
import { SessionSchema } from '@persistence/schema/session.schema';

export class IndexExerciseLogByCreatedAtMigration implements Migration {
  public apply(db: IDBDatabase, tx: IDBTransaction): void {
    const store = tx.objectStore(StoreName.EXERCISE_LOGS);
    if (!store.indexNames.contains(IndexName.ExerciseLogsByExerciseIdAndCreatedAt)) {
      const allSessionsRequest = tx.objectStore(StoreName.SESSIONS).getAll();
      allSessionsRequest.onsuccess = () => {
        const sessions = allSessionsRequest.result.map((sessionDto) =>
          SessionSchema.parse(sessionDto),
        );
        const startedAtBySessionId = sessions.reduce((index, session) => {
          index.set(session.uuid, session.startedAt);
          return index;
        }, new Map<string, string>());

        const request = store.openCursor();

        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            const value = cursor.value;
            cursor.update({
              ...value,
              createdAt: startedAtBySessionId.get(value.sessionId),
            });
            cursor.continue();
          } else {
            store.createIndex(
              IndexName.ExerciseLogsByExerciseIdAndCreatedAt,
              ['exerciseId', 'createdAt'],
              { unique: false },
            );
          }
        };
      };
    }
  }
}
